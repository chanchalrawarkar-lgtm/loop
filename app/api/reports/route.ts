import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await requireSession();

    const reports = await prisma.report.findMany({
      where: {
        workspaceId: session.workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("REPORT GET ERROR:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to load reports" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await requireSession();

    if (!["ADMIN", "ANALYST"].includes(session.role)) {
      return NextResponse.json(
        { error: "You do not have permission to generate reports." },
        { status: 403 }
      );
    }

    const feedback = await prisma.feedback.findMany({
      where: {
        workspaceId: session.workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    const positive = feedback.filter(
      (item) => item.sentiment === "POS"
    ).length;

    const negative = feedback.filter(
      (item) => item.sentiment === "NEG"
    ).length;

    const neutral = feedback.filter(
      (item) => item.sentiment === "NEU"
    ).length;

    const channelMap: Record<string, number> = {};

    feedback.forEach((item) => {
      channelMap[item.channel] =
        (channelMap[item.channel] || 0) + 1;
    });

    const topChannel =
      Object.entries(channelMap).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] || "N/A";

    const content = `Voice of Customer Report

Total feedback reviewed: ${feedback.length}

Sentiment:
Positive: ${positive}
Neutral: ${neutral}
Negative: ${negative}

Top feedback channel: ${topChannel}

Recommendations:
1. Review recurring negative feedback.
2. Investigate frequently mentioned customer issues.
3. Prioritize improvements supported by repeated customer feedback.
4. Continue monitoring sentiment trends.`;

    const report = await prisma.report.create({
      data: {
        title: "Voice of Customer Report",
        content,
        workspaceId: session.workspaceId,
      },
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("REPORT POST ERROR:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}