import { OAuth2Client } from 'google-auth-library';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const REDIRECT_URI = process.env.NODE_ENV === 'production'
  ? 'https://web-optimizer-pro.vercel.app/ads/callback' // The exact URI we will put in Google Cloud
  : 'http://localhost:5173/ads/callback';

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_ADS_CLIENT_ID,
  process.env.GOOGLE_ADS_CLIENT_SECRET,
  REDIRECT_URI
);

// 1. Generate Auth URL for the User to Click
app.get('/api/ads/auth-url', (req, res) => {
  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline', // Requires to get refresh_token
      scope: ['https://www.googleapis.com/auth/adwords'],
      prompt: 'consent' // Force to get refresh_token every time
    });
    res.json({ url: authUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Exchange Code for Tokens
app.post('/api/ads/callback', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    // In a real app, you MUST save `tokens.refresh_token` to your Supabase Database
    // tied to the currently logged in user (Clerk ID)
    res.json({ success: true, refresh_token: tokens.refresh_token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve tokens', details: err.message });
  }
});

export default app;
