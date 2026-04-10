import { Request, Response } from 'express';
// Assuming 'catchAsync', 'sendResponse', and 'httpStatus' are imported correctly
import catchAsync from '../../utils/catchAsync'; 
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status'; // Assuming you use a library like 'http-status'
import { ChatBorFunctions } from './chatbot.service';

/**
 * @description Controller function to handle chatbot requests.
 * It expects a 'prompt' in the request body.
 * Assumes the service logic for language detection and DB search is handled by ChatBorFunctions.
 */
export const ChatBotController = catchAsync(
  async (req: Request, res: Response) => {
    // 1. Get the prompt from the request body
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.BAD_REQUEST, // 400
        message: 'Prompt is required for the chatbot.',
        data: null,
      });
    }

    // 2. Call the core chatbot service function
    const chatResult = await ChatBorFunctions(prompt);

    // 3. Determine the response status and message
    const finalSuccess = chatResult.success;
    const finalStatusCode = finalSuccess ? httpStatus.OK : httpStatus.INTERNAL_SERVER_ERROR; // 200 or 500
    
    let finalMessage = 'AI response could not be generated due to a system error.';

    if (finalSuccess) {
      finalMessage = chatResult.foundResults 
        ? 'AI response generated successfully from database context.' 
        : 'AI response generated, but no specific data was found in the database.';
    }

    // 4. Send the standardized response with the new format
    sendResponse(res, {
      success: finalSuccess,
      statusCode: finalStatusCode,
      message: finalMessage,
      data: {
        aiResponse: chatResult.response,
        foundResults: chatResult.foundResults,
        sourceCount: chatResult.sourceCount,
        sources: chatResult.sources,
        language: chatResult.language,
      },
    });
  }
);