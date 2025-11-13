"use server"

import { prisma } from "@/prisma/prisma";

export async function dismissNotificationsBatch(ids: bigint[]) {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return { error: "No notification ids provided" };
  }
  console.log(ids)
  try {
    await prisma.notifications.updateMany({
      where: { id: { in: ids } },
      data: { dismissed: true },
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: e };
  }
}
