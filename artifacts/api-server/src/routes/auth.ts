import { Router } from "express";
import { users, sessions } from "../store/index";
import crypto from "crypto";

const router = Router();

function safeUser(u: (typeof users)[0]) {
  const { password: _, ...rest } = u;
  return rest;
}

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, user.id);
  res.json({ user: safeUser(user), token });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  if (token) sessions.delete(token);
  res.json({ message: "Logged out successfully" });
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const userId = sessions.get(token);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const user = users.find((u) => u.id === userId);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json(safeUser(user));
});

export default router;
