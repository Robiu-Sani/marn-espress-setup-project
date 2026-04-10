import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  createUser,
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
  updateManyUsersRole,
  updateManyUsersStatus,
  updateManyUsersIsDeleted,
} from './user.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

// Create a new user
const createUserController = catchAsync(async (req: Request, res: Response) => {
  const user = await createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User created successfully',
    data: user,
  });
});

// Get all users with search, pagination, and dynamic filters (role, gender, status, etc.)
const getAllUsersController = catchAsync(async (req: Request, res: Response) => {
  const { search, page, limit, gender, role, status, isDeleted } = req.query;

  const result = await getAllUsers({
    search: search as string,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    gender: gender as string,
    role: role as string,
    status: status as string,
    isDeleted: isDeleted === 'true',
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// Get a single user by ID
const getSingleUserController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getSingleUser(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User retrieved successfully',
    data: user,
  });
});

// Update a single user by ID
const updateSingleUserController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await updateSingleUser(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: user,
  });
});

// Delete a single user by ID (soft delete)
const deleteSingleUserController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await deleteSingleUser(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User deleted successfully',
    data: user,
  });
});

// Update many users' roles
const updateManyUsersRoleController = catchAsync(async (req: Request, res: Response) => {
  const { ids, role } = req.body;
  const result = await updateManyUsersRole(ids, role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users roles updated successfully',
    data: result,
  });
});

// Update many users' status
const updateManyUsersStatusController = catchAsync(async (req: Request, res: Response) => {
  const { ids, status } = req.body;
  const result = await updateManyUsersStatus(ids, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users status updated successfully',
    data: result,
  });
});

// Update many users' isDeleted status
const updateManyUsersIsDeletedController = catchAsync(async (req: Request, res: Response) => {
  const { ids, isDeleted } = req.body;
  const result = await updateManyUsersIsDeleted(ids, isDeleted);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users deletion status updated successfully',
    data: result,
  });
});

export default {
  createUserController,
  getAllUsersController,
  getSingleUserController,
  updateSingleUserController,
  deleteSingleUserController,
  updateManyUsersRoleController,
  updateManyUsersStatusController,
  updateManyUsersIsDeletedController,
};