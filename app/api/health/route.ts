import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const workspaceCount = await prisma.workspace.count();
    const feedbackCount = await prisma.feedback.count();
    const userCount = await prisma.user.count();

    return NextResponse.json({
      success: true,
      database: "connected",
      workspaceCount,
      feedbackCount,
      userCount,
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        database: "error",
      },
      {
        status: 500,
      }
    );
  }
}