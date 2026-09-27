import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { NextResponse } from "next/server";

const sampleFeedback = [
  {
    content: "The dashboard is very easy to use.",
    channel: "CHAT",
    customerLabel: "Simulated Customer",
  },
  {
    content: "Search results are taking too long to load.",
    channel: "SUPPORT",
    customerLabel: "Simulated Customer",
  },
  {
    content: "I really like the new analytics experience.",
    channel: "SURVEY",
    customerLabel: "Simulated Customer",
  },
  {
    content: "Please add dark mode to the application.",
    channel: "REVIEW",
    customerLabel: "Simulated Customer",
  },
  {
    content: "The onboarding process is confusing.",
    channel: "EMAIL",
    customerLabel: "Simulated Customer",
  },
];

export async function POST() {
  try {
    const session = await requireSession();

    if (!["ADMIN", "ANALYST"].includes(session.role)) {
      return NextResponse.json(
        { error: "You do not have permission to add feedback." },
        { status: 403 }
      );
    }

    const randomFeedback =
      sampleFeedback[
        Math.floor(Math.random() * sampleFeedback.length)
      ];

    const feedback = await prisma.feedback.create({
      data: {
        content: randomFeedback.content,
        channel: randomFeedback.channel,
        customerLabel: randomFeedback.customerLabel,
        sentiment: "NEU",
        status: "NEW",
        workspaceId: session.workspaceId,
      },
    });

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("SIMULATE FEEDBACK ERROR:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to simulate feedback" },
      { status: 500 }
    );
  }
}