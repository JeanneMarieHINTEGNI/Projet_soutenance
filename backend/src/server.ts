import express from 'express';
import cors from 'cors';
import { handleChatbotMessage } from './chatbot/chatbotHandler';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Chatbot endpoint
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await handleChatbotMessage(message);
    res.json(response);
  } catch (error) {
    console.error('Error in chatbot endpoint:', error);
    res.status(500).json({ 
      reply: "Désolé, une erreur est survenue. Veuillez réessayer.",
      action: null,
      data: {}
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 