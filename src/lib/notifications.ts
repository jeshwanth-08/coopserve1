import { prisma } from "./prisma";

export async function createNotification({
  userId,
  type,
  message,
  link,
}: {
  userId: string;
  type: "BOOKING_CONFIRMED" | "ASSIGNED" | "STATUS_CHANGE" | "COMMUNITY_ALERT" | "REVIEW_SUBMITTED";
  message: string;
  link?: string;
}) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        message,
        link,
      },
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
}
