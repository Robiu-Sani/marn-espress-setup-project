import express from 'express';
import { AuthRouter } from '../../module/auth/auth.router';
import { user_router } from '../../module/user/user.route';
import { chatbotRouter } from '../../module/chatbot/chatbot.router';

const routerV1 = express.Router();

// Define your module routes here
const moduleRoutes = [
  {
    path: '/auth',
    route: chatbotRouter,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/user',
    route: user_router,
  },
  /* Add more modules here as your project grows:

  */
];

/**
 * Root route to check API status
 */
routerV1.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to your version 1 API - mern-setup-system is running!",
    version: "1.0.0"
  });
});

// Iterate through the moduleRoutes array to mount them on the router
moduleRoutes.forEach((route) => {
  routerV1.use(route.path, route.route);
});

export default routerV1;