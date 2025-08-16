// api/getToken.js
import { AccessToken } from "livekit-server-sdk";

export default async function handler(req, res) {
  const { name = "guest", room = "demo-room" } = req.query;

  const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL } = process.env;
  if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
    return res.status(500).send("Missing LiveKit env vars");
  }

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: name,
  });
  at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  const token = await at.toJwt();
  res.status(200).json({ token, url: LIVEKIT_URL, room });
}
