import { Router } from "express";
const router = Router();
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    deleteAssociatedThoughts,
    addFriend,
    removeFriend
} from "../../controllers/userController.js";

// GET all users.
router.route("/").get(getAllUsers); // Tested in Insomnia and working.

// GET a single user by it _id and populated thought and friend data.
router.route("/:id").get(getUserById); // Tested in Insomnia and working.

// POST a new user.
router.route("/").post(createUser); // Tested in Insomnia and working.

// PUT to update a user by its _id.
router.route("/:id").put(updateUser); // Tested in Insomnia and working.

// DELETE to remobe a user by its _id.
router.route("/:id").delete(deleteUser); // Tested in Insomnia and working.

// BONUS: Remove a user's associated thoughts when deleted.
router.route("/:id").delete(deleteAssociatedThoughts);

// POST to add a new friend to a user's friend list.
router.route("/:userId/friends/:friendId").post(addFriend); 

// DELETE to remove a friend from a user's friend list.
router.route("/:userId/friends/:friendId").delete(removeFriend);

export default router;