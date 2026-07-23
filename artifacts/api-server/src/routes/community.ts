import { Router } from "express";
import { comments, communityPosts, counters, sessions, users } from "../store/index.js";
import type { Comment, CommunityPost } from "../types.js";

const router = Router();

function getUserFromReq(req: any) {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const userId = sessions.get(token);
  return userId ? users.find((u) => u.id === userId) : undefined;
}

// GET /api/community/posts/trending
router.get("/posts/trending", (_req, res) => {
  const trending = [...communityPosts]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);
  res.json(trending);
});

// GET /api/community/posts
router.get("/posts", (req, res) => {
  const { category, search } = req.query as { category?: string; search?: string };
  let result = [...communityPosts];
  if (category) result = result.filter((p) => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
  }
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(result);
});

// POST /api/community/posts
router.post("/posts", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { title, content, category, isAnonymous } = req.body;
  const newPost: CommunityPost = {
    id: ++counters.post,
    title,
    content,
    category,
    isAnonymous: isAnonymous ?? false,
    authorName: isAnonymous ? "Anonymous" : user.name,
    upvotes: 0,
    commentCount: 0,
    createdAt: new Date().toISOString(),
  };
  communityPosts.push(newPost);
  res.status(201).json(newPost);
});

// GET /api/community/posts/:id
router.get("/posts/:id", (req, res) => {
  const post = communityPosts.find((p) => p.id === Number(req.params.id));
  if (!post) { res.status(404).json({ error: "Post not found" }); return; }
  const postComments = comments.filter((c) => c.postId === post.id);
  res.json({ ...post, comments: postComments });
});

// POST /api/community/posts/:id/upvote
router.post("/posts/:id/upvote", (req, res) => {
  const post = communityPosts.find((p) => p.id === Number(req.params.id));
  if (!post) { res.status(404).json({ error: "Post not found" }); return; }
  post.upvotes++;
  res.json(post);
});

// POST /api/community/posts/:id/comments
router.post("/posts/:id/comments", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const post = communityPosts.find((p) => p.id === Number(req.params.id));
  if (!post) { res.status(404).json({ error: "Post not found" }); return; }

  const { content, isAnonymous } = req.body;
  const newComment: Comment = {
    id: ++counters.comment,
    postId: post.id,
    content,
    authorName: isAnonymous ? "Anonymous" : user.name,
    isAnonymous: isAnonymous ?? false,
    createdAt: new Date().toISOString(),
  };
  comments.push(newComment);
  post.commentCount++;
  res.status(201).json(newComment);
});

// DELETE /api/community/posts/:id/moderate
router.delete("/posts/:id/moderate", (req, res) => {
  const idx = communityPosts.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) { res.status(404).json({ error: "Post not found" }); return; }
  communityPosts.splice(idx, 1);
  res.json({ message: "Post removed successfully" });
});

export default router;
