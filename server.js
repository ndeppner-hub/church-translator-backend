const express = require("express");
const WebSocket = require("ws");
const { OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/translate", async (req, res) => {
  const { text } = req.body;
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a professional interpreter translating English into natural Swahili suitable for a live church sermon."
      },
      {
        role: "user",
        content: `Translate this to Swahili: ${text}`
      }
    ]
  });

  const swahiliText = chatCompletion.choices[0].message.content;
  res.json({ swahiliText });
});

const server = app.listen(4000, () => console.log("Server running on http://localhost:4000"));

const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});
