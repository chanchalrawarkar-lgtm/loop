import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await requireSession();

    const body = await request.json();
    const question = body?.question?.trim();

    if (!question) {
      return NextResponse.json(
        { error: "Please enter a question." },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.findMany({
      where: {
        workspaceId: session.workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        content: true,
        channel: true,
        sentiment: true,
        customerLabel: true,
      },
    });

    if (feedback.length === 0) {
      return NextResponse.json({
        answer: "No customer feedback is available yet.",
        supportingFeedback: [],
      });
    }

    const positive = feedback.filter(
      (item) => item.sentiment === "POS"
    ).length;

    const negative = feedback.filter(
      (item) => item.sentiment === "NEG"
    ).length;

    const neutral = feedback.filter(
      (item) => item.sentiment === "NEU"
    ).length;

    let sentimentSummary = "mixed";

    if (positive > negative && positive > neutral) {
      sentimentSummary = "mostly positive";
    } else if (negative > positive && negative > neutral) {
      sentimentSummary = "mostly negative";
    }

    const answer = `Based on the latest ${feedback.length} customer feedback items, the overall feedback is ${sentimentSummary}.

Sentiment breakdown:
• Positive: ${positive}
• Negative: ${negative}
• Neutral: ${neutral}

LOOP reviewed the available customer feedback for your question:
"${question}"

The supporting feedback below provides the evidence currently available in the workspace.`;

    return NextResponse.json({
      answer,
      supportingFeedback: feedback,
    });
  } catch (error) {
    console.error("ASK ERROR:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}