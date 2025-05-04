import express from 'express';
import bodyParser from 'body-parser';
import { Webhook } from 'svix';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js'; // Adjust if needed

dotenv.config();

const router = express.Router();

router.post(
  '/',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const payloadString = req.body.toString();
      const svixHeaders = req.headers;

      console.log('🪵 Headers:', svixHeaders);
      console.log('📦 Payload:', payloadString);

      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
      const evt = wh.verify(payloadString, svixHeaders);

      const { id, ...attributes } = evt.data;
      const eventType = evt.type;

      if (eventType === 'user.created') {
        const fullName = `${attributes.first_name} ${attributes.last_name}`;
        const imageUrl = attributes.image_url;

        const existingUser = await User.findOne({ clerkId: id });

        if (!existingUser) {
          const user = new User({
            clerkId: id,
            fullName,
            imageUrl,
          });

          await user.save();
          console.log('✅ Clerk user saved to DB');
        } else {
          console.log('ℹ️ User already exists in DB');
        }
      }

      res.status(200).json({ success: true, message: 'Webhook received' });
    } catch (err) {
      console.error('❌ Webhook error:', err.message);
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

export default router;
