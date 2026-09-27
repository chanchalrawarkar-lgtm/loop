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
        createdAt: "asc",
      },
      select: {
        id: true,
        content: true,
        channel: true,
        sentiment: true,
        status: true,
        createdAt: true,
      },
    });

    const sentiment = {
      positive: feedback.filter((item) => item.sentiment === "POS").length,
      neutral: feedback.filter((item) => item.sentiment === "NEU").length,
      negative: feedback.filter((item) => item.sentiment === "NEG").length,
    };

    const channelMap: Record<string, number> = {};

    feedback.forEach((item) => {
      channelMap[item.channel] =
        (channelMap[item.channel] || 0) + 1;
    });

    const channels = Object.entries(channelMap).map(
      ([channel, count]) => ({
        channel,
        count,
      })
    );

    const keywordMap: Record<string, number> = {};

    feedback.forEach((item) => {
      const words = item.content
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/);

      words.forEach((word) => {
        if (
          word.length >= 5 &&
          ![
            "about",
            "please",
            "really",
            "there",
            "their",
            "would",
            "could",
            "should",
            "customer",
            "feedback",
          ].includes(word)
        ) {
          keywordMap[word] = (keywordMap[word] || 0) + 1;
        }
      });
    });

    const keywords = Object.entries(keywordMap)
      .map(([word, count]) => ({
        word,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    const dailyMap: Record<
      string,
      {
        date: string;
        positive: number;
        neutral: number;
        negative: number;
      }
    > = {};

    feedback.forEach((item) => {
      const date = item.createdAt.toISOString().slice(0, 10);

      if (!dailyMap[date]) {
        dailyMap[date] = {
          date,
          positive: 0,
          neutral: 0,
          negative: 0,
        };
      }

      if (item.sentiment === "POS") {
        dailyMap[date].positive++;
      } else if (item.sentiment === "NEG") {
        dailyMap[date].negative++;
      } else {
        dailyMap[date].neutral++;
      }
    });

    return NextResponse.json({
      success: true,
      total: feedback.length,
      sentiment,
      channels,
      keywords,
      timeline: Object.values(dailyMap),
    });
  } catch (error) {
    console.error("TRENDS API ERROR:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to load trends" },
      { status: 500 }
    );
  }
}