import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getFileUrl } from "../utils/uploadUtils";

const prisma = new PrismaClient();

// Upload files for chat messages
export const uploadChatFiles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { chatId } = req.params;

    // Check if chat exists
    const chat = await prisma.chat.findUnique({
      where: { id: Number(chatId) },
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    if (chat.isDeleted) {
      res.status(410).json({ message: "This chat has been deleted" });
      return;
    }

    // Check if user is part of this chat
    const userId = req.user?.id;
    if (!userId || (chat.tenantId !== userId && chat.managerId !== userId)) {
      res.status(403).json({ message: "You are not part of this chat" });
      return;
    }

    // Process uploaded files
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ message: "No files uploaded" });
      return;
    }

    // Generate URLs for uploaded files
    const fileUrls = files.map((file) => getFileUrl(req, file.filename));

    res.status(201).json({
      message: "Files uploaded successfully",
      files: fileUrls,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error uploading files: ${error.message}` });
  }
};
