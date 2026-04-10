import express from 'express';
import { ChatBotController } from './chatbot.controller';

const router = express.Router();

router.post('/',ChatBotController)

export const chatbotRoute = router 