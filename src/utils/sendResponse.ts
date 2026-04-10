import { Response } from 'express';

// Define the shape of pagination/metadata
type TMeta = {
  limit?: number;
  page?: number;
  total?: number;
  totalPage?: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: TMeta; // Made optional
  data?: T;     // Made optional
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || "Operation successful",
    meta: data.meta || null, // Defaults to null if not provided
    data: data.data || null, // Defaults to null if not provided
  });
};

export default sendResponse;