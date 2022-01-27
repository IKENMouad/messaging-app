const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("chat-window");
const chatbox = document.getElementById("chat-box");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");

let connections = [];
const username = prompt("What is your name?");
if (username) {
  chatbox.style.opacity = 1;
}

socket.emit("new-user", username);
connections = [...connections, username];
socket.on("chat-message", (data) => {
  const { message, name } = data;
  appendArticle({ message, user: name });
});

socket.on("user-connected", (name) => {
  // alert("You are connected");
});

socket.on("user-disconnected", (name) => {
  // alert("You are disconnected");
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  socket.emit("send-chat-message", message);
  appendArticle({ message, user: "self" });
  messageInput.value = "";
});

function appendArticle({ message, user }) {
  let newArticle = document.createElement("article");
  newArticle.classList.add("msg-container");
  newArticle.classList.add(user === "self" ? "msg-self" : "msg-remote");

  let msgBox = document.createElement("div");
  msgBox.classList.add("msg-box");
  newArticle.append(msgBox);

  let flr = document.createElement("div");
  flr.classList.add("flr");

  let img = document.createElement("img");
  const imgSrc =
    user === "self"
      ? "https://media-exp1.licdn.com/dms/image/C4D03AQEYfNi6d32Q3w/profile-displayphoto-shrink_800_800/0/1574939885902?e=1648684800&v=beta&t=iEgw_NEONpjiKfNZXEjBNkkunRRcETEexfk0GC7Hqtg"
      : "https://profile-images.xing.com/images/88a75bd9eb03bb968feead8a683e3545-1/youssef-el-idrissi-slimani.256x256.jpg";
  img.classList.add("user-img");
  img.src = imgSrc;
  if (user === "self") {
    msgBox.append(flr);
    msgBox.append(img);
  } else {
    msgBox.append(img);
    msgBox.append(flr);
  }

  let messages = document.createElement("div");
  messages.classList.add("messages");
  flr.append(messages);

  let messagePara = document.createElement("p");
  messagePara.innerText = message;
  messagePara.classList.add("msg");

  messages.append(messagePara);

  messageContainer.append(newArticle);
}
