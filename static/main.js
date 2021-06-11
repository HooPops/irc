let name = ""
//losowy kolor nicku
let color = `#${(Math.round(0xffffff * Math.random())).toString(16)}`

let lastMessageId = -1;
let scrollBar


const chatDiv = document.getElementById('chat')
const input = document.getElementById("messageInput")


function sendMessage() {
    let msg = input.value
    input.value = ""
    if (msg != "") {
        if (msg[0] == "/") {
            let command = msg.split(" ")
            if (command[0] == "/color") {
                let d = document.createElement("div")
                d.classList.add("commands")
                //jeżeli user nie wpisze to kolor jest losowany

                if (command[1] != undefined) {
                    color = command[1]
                    d.innerText = "Zmieniono kolor na " + color;
                }
                else {
                    color = `#${(Math.round(0xffffff * Math.random())).toString(16)}`
                    d.innerText = "Zmieniono kolor na losowo wybrany";
                }

                scrollBar.getContentElement().appendChild(d)
            }
            if (command[0] == "/nick") {
                let d = document.createElement("div")
                d.classList.add("commands")
                if (command[1] != undefined) {
                    name = command[1]
                    d.innerText = "Zmieniono nick na " + name
                }
                else {
                    d.innerText = "Nie zmieniono nicku"
                }

                scrollBar.getContentElement().appendChild(d)
            }
            if (command[0] == "/help") {
                let d = document.createElement("div")
                d.classList.add("commands")
                d.innerText = "Dozwolone komendy: /color kolor /nick nazwa /help"
                scrollBar.getContentElement().appendChild(d)
            }
            if (command[0] == "/quit") {
                window.location = "/"

            }
        } else {
            fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ client: { name: name, color: color }, message: msg })
            })
        }
    }
}

async function getMessages() {
    //czekanie na wiadomości
    const res = await fetch(`/chat?last=${lastMessageId}`);
    if (res.status == 200) {
        const data = await res.json();
        data.forEach(m => {
            let msg = m.message
            let messageDiv = document.createElement("div")
            let time = document.createElement("span")
            let nickname = document.createElement("span")
            let writtenMessage = document.createElement("span")

            time.innerText = "[" + new Date().toLocaleTimeString() + "]"

            messageDiv.classList.add("message")

            nickname.innerText = "<@" + msg.client.name + ">"
            nickname.style.color = msg.client.color
            writtenMessage.innerText = msg.message
            //zamiana wiadomości w emotke
            $(writtenMessage).emoticonize()

            messageDiv.appendChild(time)
            messageDiv.appendChild(nickname)
            messageDiv.appendChild(writtenMessage)
            let cont = scrollBar.getContentElement();
            cont.appendChild(messageDiv)
            //po dodaniu wiadomości automatyczne scrollowanie
            let scroll = scrollBar.getScrollElement();
            scroll.scrollTop = scroll.scrollHeight
        })
        lastMessageId = data[data.length - 1].id
    }
    getMessages()
}


function init() {
    name = prompt("Podaj nick: ")
    //wysyłanie enterem
    input.addEventListener("keyup", (e) => {
        if (e.keyCode == 13) sendMessage();
    })
    //tworzenie scrollbara
    scrollBar = new SimpleBar(chatDiv, { autoHide: true });
    getMessages()
}

init()