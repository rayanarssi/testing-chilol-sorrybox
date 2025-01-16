const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const sorrybox = document.querySelector(".sorrybox");

let userMessage;
const API_KEY = "AIzaSyDBvuW6a8or9z-Si1TeipBcGFQ4-odr_E0";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<img src="./images/sorrybot.png" alt="Smart Toy Icon" class="smart-toy-icon" /><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    }),
  };

  // Send POST request to API, get response
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.candidates[0].content.parts[0].text; // Update message text with API
    })
    .catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent = "Oops! Iets ging mis. Probeer het opnieuw.";
    })
    .finally(() => sorrybox.scrollTo(0, sorrybox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  console.log(userMessage);
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the sorrybox
  sorrybox.appendChild(createChatLi(userMessage, "outgoing"));
  sorrybox.scrollTo(0, sorrybox.scrollHeight);

  setTimeout(() => {
    // Display the "Aan het denken" message while waiting for the response
    const incomingChatLi = createChatLi("Aan het denken...", "incoming");
    sorrybox.appendChild(incomingChatLi);
    sorrybox.scrollTo(0, sorrybox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

chatInput.addEventListener("input", () => {
  // Adjust the height of the chat input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // If Enter key is pressed without Shift key and the window
  // width is greater than 800px, handle the chat
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
