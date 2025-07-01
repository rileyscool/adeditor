const express = require('express')
const { default: ollama } = require('ollama'); // why do i have to do this??? stupid
const app = express()
// this is so corny
app.use(express.json())

async function ai(prompt) {
    console.log(prompt)
    const response = await ollama.chat({
        model: 'llama3.2',
        messages: [
            { role: 'system', content: "You are a website editor, users will prompt you on what to change about the webpage, and you are only to respond with the new code for the page. Do not reply with anything else. Do not remove the prompt box, button, or script for the prompt. Always provide the full code. The current webpage markdown is: "+require("fs").readFileSync(__dirname+"/views/index.html")} ,
            { role: 'user', content: prompt }
        ]
    })
    console.log("changed")
    require('fs').writeFileSync(__dirname+"/views/index.html", response.message.content)
        console.log(response.message.content)

}
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})

app.post("/prompt", async (req, res) => {
    try {
        const result = await ai(req.body.prompt)
        res.json({ response: result })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to get response from AI' })
    }
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})
