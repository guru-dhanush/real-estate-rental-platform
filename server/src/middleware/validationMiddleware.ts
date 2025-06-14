import { Request, Response, NextFunction } from "express";

export const validateMessageContent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { content } = req.body;
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: "Message content is required" });
  }
  if (content.length > 2000) {
    return res
      .status(400)
      .json({ message: "Message exceeds 2000 character limit" });
  }
  next();
};

export const validateMeetingTime = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { proposedTime } = req.body;
  const time = new Date(proposedTime);

  if (isNaN(time.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }
  if (time < new Date()) {
    return res
      .status(400)
      .json({ message: "Meeting time must be in the future" });
  }
  next();
};
