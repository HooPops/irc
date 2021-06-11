const express = require("express")
const app = express()
const path = require("path")
const PORT = process.env.PORT || 3000

app.use(express.static("static"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

let clients = []
let messages = []

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/static/index.html"))
})

app.get("/chat", (req, res) => {
    if (messages.length == 0 || req.query.last == -1 || req.query.last == messages[messages.length - 1].id) {
        clients.push(res)
    } else {
        let toSend = messages.filter(e => e.id > req.query.last)
        res.send(toSend)
    }
})

app.post("/chat", (req, res) => {
    let msg = { id: messages.length, message: req.body }
    messages.push(msg)
    //usuwanie zbędnych wiadomości
    if (messages.length > 50) messages.shift()
    clients.forEach(sub => {
        sub.send([msg])
    })
    clients = []
    res.end()
})

app.listen(PORT, () => { })