import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await requireSession();

    const feedback = await prisma.feedback.findMany({
      where: {
        workspaceId: session.workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        channel: true,
        customerLabel: true,
        sentiment: true,
        sentimentScore: true,
        status: true,
        createdAt: true,
      },
    });

    const total = feedback.length;

    const positive = feedback.filter(
      (item) => item.sentiment === "POS"
    ).length;

    const negative = feedback.filter(
      (item) => item.sentiment === "NEG"
    ).length;

    const neutral = feedback.filter(
      (item) => item.sentiment === "NEU"
    ).length;

    const newCount = feedback.filter(
      (item) => item.status === "NEW"
    ).length;

    const reviewedCount = feedback.filter(
      (item) => item.status === "REVIEWED"
    ).length;

    const actionedCount = feedback.filter(
      (item) => item.status === "ACTIONED"
    ).length;

    const channelCounts: Record<string, number> = {};

    feedback.forEach((item) => {
      channelCounts[item.channel] =
        (channelCounts[item.channel] || 0) + 1;
    });

    const channels = Object.entries(channelCounts)
      .map(([channel, count]) => ({
        channel,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      stats: {
        total,
        positive,
        negative,
        neutral,
        newCount,
        reviewedCount,
        actionedCount,
      },
      channels,
      recentFeedback: feedback.slice(0, 10),
    });
  } catch (error) {
    console.error("DASHBOARD API ERROR:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}