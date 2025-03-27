import { Reaction, Thought, User } from "../models/index.js";

// GET all users
// Tested in Insomnia and working.
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .populate({
        path: "thoughts",
        select: "thoughtText createdAt",
        populate: {
          path: "reactions",
          select: "reactionBody username createdAt",
        },
      })
      .populate({
        path: "friends",
        select: "username",
      });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET a single user by its _id and populated thought and friend data
// Tested in Insomnia and working.
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    .populate({
        path: "thoughts",
        select: "thoughtText createdAt",
        populate: {
          path: "reactions",
          select: "reactionBody username createdAt",
        },
      })
      .populate({
        path: "friends",
        select: "username",
      });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST a new user
// Tested in Insomnia and working.
export const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    console.log("New user created: ", newUser);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT to update a user by its _id
// Tested in Insomnia and working.
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE to remove a user by its _id
// Tested in Insomnia and working.
// BONUS: Remove a user's associated thoughts when deleted
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Delete associated thoughts
    await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// BONUS: Remove a user's associated thoughts when deleted
export const deleteAssociatedThoughts = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await Thought.deleteMany({ _id: { $in: user.thoughts } });
    res
      .status(200)
      .json({ message: "User and associated thoughts deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST to add a new friend to a user's friend list
export const addFriend = async (_req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      _req.params.userId,
      { $push: { friends: _req.params.friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE to remove a friend from a user's friend list
export const removeFriend = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
