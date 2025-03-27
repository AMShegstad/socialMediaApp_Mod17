import { Reaction, Thought, User } from "../models/index.js";

// GET all thoughts.
// Tested in Insomnia and working.
export const getAllThoughts = async (_req, res) => {
    try {
        const thoughts = await Thought.find().populate({
            path: "reactions",
            populate: {
                path: "username", // Assuming `username` is a reference field in the Reaction model
                select: "username" // Populate the username field instead of the _id
            },
            select: "reactionBody username createdAt"
        });

        const reorderedThoughts = thoughts.map((thought) => {
            const { _id, thoughtText, username, createdAt, reactions } =
                thought.toObject();
            const updatedReactions = reactions.map((reaction) => ({
                reactionBody: reaction.reactionBody,
                username: reaction.username,
                createdAt: reaction.createdAt
            }));
            return { _id, thoughtText, username, createdAt, reactions: updatedReactions };
        });
        res.json(reorderedThoughts);
    } catch (err) {
        res.status(400).json(err);
    }
};
// GET a single thoguht by its _id.
// Tested in Insomnia and working.
export const getThoughtById = async (_req, res) => {
  try {
    const thoughtId = _req.params.id;

    const thought = await Thought.findOne({ _id: thoughtId }).populate({
      path: "reactions",
      select: "reactionBody username",
    });

    if (!thought) {
      return res
        .status(404)
        .json({ message: "No thought found with this id!" });
    }

    res.json({ thoughtText: thought.thoughtText });
  } catch (err) {
    res.status(400).json(err);
  }
};

// POST to create a new thought. Don't forget to push the created thought's _id to the associated user's thoughts array field. You'll also need to update the User model to include this field.
// Tested in Insomnia and working.
export const createThought = async (_req, res) => {
  try {
    const { userId, ...thoughtData } = _req.body;

    // Create the thought
    const thought = await Thought.create(thoughtData);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    // Find the user and push the thought's _id to their thoughts array
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { thoughts: thought._id } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user found with this id!" });
    }

    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
};
// PUT to update a thought by its _id.
// Tested in Insomnia and working.
export const updateThought = async (_req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      _req.params.id,
      _req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedThought) {
      return res
        .status(404)
        .json({ message: "No thought found with this id!" });
    }
    res.status(200).json(updatedThought);
  } catch (err) {
    res.status(400).json(err);
  }
};

// DELETE to remove a thought by its _id.
// Tested in Insomnia and working.
export const deleteThought = async (_req, res) => {
  try {
    const deleteThought = await Thought.findByIdAndDelete(_req.params.id);
    if (!deleteThought) {
      return res
        .status(404)
        .json({ message: "No thought found with this id!" });
    }
    res.status(200).json({ message: "Thought deleted successfully!" });
  } catch (err) {
    res.status(400).json(err);
  }
};

// POST to create a reaction stored in a single thought's reactions array field.
export const createReaction = async (_req, res) => {
  try {
    const createdReaction = await Reaction.create(_req.body);
    const thought = await Thought.findByIdAndUpdate(
      _req.params.thoughtId,
      { $push: { reactions: createdReaction._id } },
      { new: true }
    );
    res.status(200).json(createdReaction);
  } catch (err) {
    res.status(400).json(err);
  }
};

// DELETE to pull and remove a reaction by the reaction's reactionId value.
export const deleteReaction = async (_req, res) => {
  try {
    // Delete the reaction from the Reaction collection
    const deletedReaction = await Reaction.findByIdAndDelete(
      _req.params.reactionId
    );
    if (!deletedReaction) {
      return res
        .status(404)
        .json({ message: "No reaction found with this id!" });
    }

    // Remove the reaction ID from the Thought's reactions array
    const thought = await Thought.findByIdAndUpdate(
      _req.params.thoughtId,
      { $pull: { reactions: _req.params.reactionId } },
      { new: true }
    );

    if (!thought) {
      return res
        .status(404)
        .json({ message: "No thought found with this id!" });
    }

    res.status(200).json({ message: "Reaction deleted successfully!" });
  } catch (err) {
    res.status(400).json(err);
  }
};
