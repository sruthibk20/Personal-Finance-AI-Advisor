const User = require("../models/User");

const buildUserPayload = (user) => ({
  userId: user._id,
  name: user.name,
  email: user.email,
  profileImage: user.profileImage || "",
  createdAt: user.createdAt
});

// REGISTER
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(buildUserPayload(user));
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

// GET PROFILE
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(buildUserPayload(user));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// UPDATE PROFILE
const updateUserProfile = async (req, res) => {
  try {
    const { name, profileImage } = req.body;

    const updatePayload = {};

    if (name !== undefined) {
      const trimmedName = String(name).trim();

      if (!trimmedName) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }

      updatePayload.name = trimmedName;
    }

    if (profileImage !== undefined) {
      updatePayload.profileImage = profileImage;
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ message: "No profile changes provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(buildUserPayload(updatedUser));
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
