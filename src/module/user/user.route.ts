import express from 'express';
import UserController from './user.controllar';
import { uploadImageSingle } from '../../middleware/upload-image-imaehost';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constent';

const router = express.Router();

// --- Retrieval Routes ---

// Handles: Get All, Search, and Filtering (by role, status, gender, isDeleted)
// Example: /users?role=admin&status=in-progress
router.get('/',  auth(USER_ROLE.ADMIN,USER_ROLE.SUPER_ADMIN , USER_ROLE.DEVELOPER), UserController.getAllUsersController);

// Get single user by ID
router.get('/:id', UserController.getSingleUserController);


// --- Action Routes ---

// Create User (with single image upload)
router.post(
  '/', 
  uploadImageSingle('image'), 
  UserController.createUserController
);

// Update single user (with single image upload)
router.patch(
  '/:id', auth(USER_ROLE.ADMIN,USER_ROLE.MANAGER,USER_ROLE.SUPER_ADMIN , USER_ROLE.DEVELOPER, USER_ROLE.STAFF , USER_ROLE.USER),
  uploadImageSingle('image'), 
  UserController.updateSingleUserController
);

// Delete single user (soft delete)
router.delete('/:id', UserController.deleteSingleUserController);


// --- Bulk Update Routes ---

// Update multiple users' roles
router.patch(
  '/update-role', 
  UserController.updateManyUsersRoleController
);

// Update multiple users' status
router.patch(
  '/update-status', 
  UserController.updateManyUsersStatusController
);

// Update multiple users' isDeleted status
router.patch(
  '/update-is-deleted',
  UserController.updateManyUsersIsDeletedController
);

export const user_router = router;