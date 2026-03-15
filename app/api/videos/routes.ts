import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);

  } catch (error: any) {
    console.error(error);
  }
};
