import express from "express";
import {
  getUserChats,
  getChatById,
  createChat,
  deleteChat,
  sendMessage,
  markMessageAsRead,
  markAllMessagesAsRead,
} from "../controllers/chatControllers";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadChatFiles } from "../controllers/uploadControllers";
import { upload } from "../utils/uploadUtils";

const router = express.Router();

// Get all chats for a user
router.get("/", authMiddleware(["tenant", "manager"]), getUserChats);

// Get a single chat by ID
router.get("/:id", authMiddleware(["tenant", "manager"]), getChatById);

// Create a new chat
router.post("/", authMiddleware(["tenant", "manager"]), createChat);

// Mark chat as deleted (soft delete)
router.delete("/:id", authMiddleware(["tenant", "manager"]), deleteChat);

// Send a message
router.post(
  "/:chatId/messages",
  authMiddleware(["tenant", "manager"]),
  sendMessage
);

// Mark a message as read
router.put(
  "/messages/:id/read",
  authMiddleware(["tenant", "manager"]),
  markMessageAsRead
);

// Mark all messages in a chat as read
router.put(
  "/:chatId/messages/read",
  authMiddleware(["tenant", "manager"]),
  markAllMessagesAsRead
);

// Upload files for chat messages
router.post(
  "/:chatId/uploads",
  authMiddleware(["tenant", "manager"]),
  upload.array("files", 5),
  uploadChatFiles
);

export default router;
