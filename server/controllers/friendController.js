import Friend from '../models/friend.js';

export const getAllFriends = async (req, res) => {
  try {
    // Assuming the userId is in req.user, which should be set by the JWT middleware
    const userId = req.userId;

    const friends = await Friend.find({ userId }).sort({ name: 1 });
    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createFriend = async (req, res) => {
  try {
    // Extract the userId from the JWT token (assuming the middleware has done this)
    const userId = req.userId;

    // Add the userId field to the friend document
    const newFriend = new Friend({
      ...req.body,
      userId: userId // Attach the userId here
    });

    const savedFriend = await newFriend.save();
    res.status(201).json(savedFriend);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateFriend = async (req, res) => {
  try {
    // Extract the userId from the JWT token (assuming the middleware has done this)
    const userId = req.userId;

    // Update the friend, ensuring the userId matches (security measure)
    const updatedFriend = await Friend.findOneAndUpdate(
      { id: req.params.id, userId: userId }, // Make sure we're updating the correct user's friend
      { $set: { name: req.body.name } },
      { new: true }
    );

    if (!updatedFriend) {
      return res.status(404).json({ error: 'Friend not found or you are not authorized to update this friend' });
    }

    res.json(updatedFriend);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteFriend = async (req, res) => {
  try {
    // Extract the userId from the JWT token
    const userId = req.userId;

    // Delete the friend, ensuring the userId matches
    const deletedFriend = await Friend.findOneAndDelete({ id: req.params.id, userId: userId });

    if (!deletedFriend) {
      return res.status(404).json({ error: 'Friend not found or you are not authorized to delete this friend' });
    }

    res.json({ message: 'Friend deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
