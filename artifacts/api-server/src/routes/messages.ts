import { Router } from "express";
import { counters, messageThreads, messages, sessions, users } from "../store/index";
import type { Message, MessageThread } from "../types";

const router = Router();

function getUserFromReq(req: any) {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const userId = sessions.get(token);
  return userId ? users.find((u) => u.id === userId) : undefined;
}

// GET /api/messages/threads
router.get("/threads", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const threads = messageThreads.filter((t) => t.userId === user.id || t.counterpartId === user.id);
  res.json(threads);
});

// POST /api/messages/threads
router.post("/threads", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { counterpartId, counterpartRole, initialMessage } = req.body;
  const counterpart = users.find((u) => u.id === Number(counterpartId));

  const newThread: MessageThread = {
    id: ++counters.thread,
    userId: user.id,
    counterpartId: Number(counterpartId),
    counterpartName: counterpart?.name ?? "Support Team",
    counterpartRole: counterpartRole,
    lastMessage: initialMessage,
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
  };
  messageThreads.push(newThread);

  // Add the initial message
  const msg: Message = {
    id: ++counters.message,
    threadId: newThread.id,
    senderId: user.id,
    senderName: user.name,
    content: initialMessage,
    sentAt: new Date().toISOString(),
    isOwn: true,
  };
  messages.push(msg);

  res.status(201).json(newThread);
});

// GET /api/messages/threads/:id
router.get("/threads/:id", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const thread = messageThreads.find((t) => t.id === Number(req.params.id));
  if (!thread) { res.status(404).json({ error: "Thread not found" }); return; }

  const threadMessages = messages
    .filter((m) => m.threadId === thread.id)
    .map((m) => ({ ...m, isOwn: m.senderId === user.id }))
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

  res.json({
    id: thread.id,
    counterpartName: thread.counterpartName,
    counterpartRole: thread.counterpartRole,
    messages: threadMessages,
  });
});

// POST /api/messages/threads/:id/send
router.post("/threads/:id/send", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const thread = messageThreads.find((t) => t.id === Number(req.params.id));
  if (!thread) { res.status(404).json({ error: "Thread not found" }); return; }

  const { content } = req.body;
  const newMsg: Message = {
    id: ++counters.message,
    threadId: thread.id,
    senderId: user.id,
    senderName: user.name,
    content,
    sentAt: new Date().toISOString(),
    isOwn: true,
  };
  messages.push(newMsg);
  thread.lastMessage = content;
  thread.lastMessageAt = newMsg.sentAt;

  res.status(201).json(newMsg);
});

export default router;
