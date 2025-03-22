const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");


let userMessage;
const API_KEY = "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";

const createChatLi = (message, className) => {
    // chat variable that passes a message and class
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateResponse = () => {
    const API_URL = "https://api.openai.com/v1/chat/completions";

    const requestOptions = { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
         },
         body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}]
         })
     }

     //AI generates  response.  If there is an error it will be logged
     fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        console.log(data);
     }).catch((error) => {
        console.log(error);
     })
 }

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    
    // User message is added to the chat box
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    setTimeout(() => {
        // chat bot begins generating message
        chatbox.appendChild(createChatLi("....", "incoming"));
        generateResponse();
    }, 600);
}

sendChatBtn.addEventListener("click", handleChat);