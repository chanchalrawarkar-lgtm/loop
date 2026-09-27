import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.content?.trim()) {
      return NextResponse.json(
        { success: false, error: "Feedback content is required" },
        { status: 400 }
      );
    }

    const workspace = await prisma.workspace.findFirst();

    if (!workspace) {
      return NextResponse.json(
        { success: false, error: "Workspace not found" },
        { status: 404 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        content: body.content.trim(),
        channel: body.channel || "WEB",
        customerLabel: body.customerLabel || "Manual Customer",
        sentiment: "NEU",
        sentimentScore: 0,
        status: "NEW",
        workspaceId: workspace.id,
      },
    });

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create feedback",
      },
      { status: 500 }
    );
  }
}