import { User } from '../models/user.model.js';

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;
    console.log("Received user data:", req.body);

    const existingUser = await User.findOne({ clerkId: id });
    if (!existingUser) {
      const newUser = await User.create({
        clerkId: id,
        fullName: `${firstName || ''} ${lastName || ''}`.trim(),
        imageUrl
      });
      console.log("New user created:", newUser);
    } else {
      console.log("User already exists:", existingUser);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in /auth/callback:", error);
    next(error);
  }
};