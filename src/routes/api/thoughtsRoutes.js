import { Router } from "express";
const router = Router();
import {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction
} from "../../controllers/thoughtController.js";

// GET all thoughts.
router.route("/").get(getAllThoughts);

// GET a single thoguht by its _id.
router.route("/:id").get(getThoughtById);

// POST to create a new thought. Don't forget to push the created thought's _id to the associated user's thoughts array field. You'll also need to update the User model to include this field.
router.route("/").post(createThought);

// PUT to update a thought by its _id.
router.route("/:id").put(updateThought);

// DELETE to remove a thought by its _id.
router.route("/:id").delete(deleteThought);

// POST to create a reaction stored in a single thought's reactions array field.
router.route("/:thoughtId/reactions").post(createReaction);

// DELETE to pull and rmeove a reaction by the reaction's reactionId value.
router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

export default router;