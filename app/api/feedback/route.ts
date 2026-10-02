import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { canManageFeedback } from "@/lib/permissions";

export const dynamic = "force-dynamic";

/* -------------------------------------------------------
   Simple sentiment detection
------------------------------------------------------- */

function detectSentiment(text: string): {
  sentiment: "POS" | "NEU" | "NEG";
  sentimentScore: number;
} {
  const value = text.toLowerCase();

  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "awesome",
    "love",
    "loved",
    "happy",
    "helpful",
    "easy",
    "smooth",
    "fast",
    "quick",
    "perfect",
    "fantastic",
    "wonderful",
    "best",
    "nice",
    "useful",
    "satisfied",
    "impressed",
    "convenient",
    "simple",
    "works well",
    "very good",
    "thank",
    "thanks",
  ];

  const negativeWords = [
    "bad",
    "poor",
    "terrible",
    "horrible",
    "awful",
    "hate",
    "hated",
    "angry",
    "slow",
    "bug",
    "bugs",
    "broken",
    "error",
    "errors",
    "problem",
    "problems",
    "issue",
    "issues",
    "difficult",
    "hard",
    "confusing",
    "frustrating",
    "frustrated",
    "failed",
    "failure",
    "crash",
    "crashes",
    "crashing",
    "worst",
    "unhappy",
    "disappointed",
    "disappointing",
    "annoying",
    "annoyed",
    "useless",
    "not working",
    "doesn't work",
    "doesnt work",
    "cannot",
    "can't",
    "cant",
  ];

  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of positiveWords) {
    if (value.includes(word)) {
      positiveScore++;
    }
  }

  for (const word of negativeWords) {
    if (value.includes(word)) {
      negativeScore++;
    }
  }

  if (positiveScore > negativeScore && positiveScore > 0) {
    return {
      sentiment: "POS",
      sentimentScore: Math.min(0.95, 0.6 + positiveScore * 0.08),
    };
  }

  if (negativeScore > positiveScore && negativeScore > 0) {
    return {
      sentiment: "NEG",
      sentimentScore: -Math.min(0.95, 0.6 + negativeScore * 0.08),
    };
  }

  return {
    sentiment: "NEU",
    sentimentScore: 0,
  };
}

/* -------------------------------------------------------
   GET feedback
------------------------------------------------------- */

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
    });

    return NextResponse.json(feedback, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/feedback error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch feedback",
      },
      {
        status: 500,
      }
    );
  }
}

/* -------------------------------------------------------
   POST feedback
------------------------------------------------------- */

export async function POST(request: Request) {
  try {
    const session = await requireSession();

    if (!canManageFeedback(session)) {
      return NextResponse.json(
        {
          success: false,
          error: "You do not have permission to add feedback",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const content = String(body.content || "").trim();

    const channel = String(body.channel || "Manual").trim();

    const customerLabel = body.customerLabel
      ? String(body.customerLabel).trim()
      : null;

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "Feedback content is required",
        },
        {
          status: 400,
        }
      );
    }

    // Automatically detect sentiment from feedback text
    const { sentiment, sentimentScore } = detectSentiment(content);

    const feedback = await prisma.feedback.create({
      data: {
        content,
        channel,
        customerLabel,

        sentiment,
        sentimentScore,

        status: "NEW",

        workspaceId: session.workspaceId,
      },
    });

    return NextResponse.json(feedback, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/feedback error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create feedback",
      },
      {
        status: 500,
      }
    );
  }
}

/* -------------------------------------------------------
   PATCH feedback status
------------------------------------------------------- */

export async function PATCH(request: Request) {
  try {
    const session = await requireSession();

    if (!canManageFeedback(session)) {
      return NextResponse.json(
        {
          success: false,
          error: "You do not have permission to update feedback",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const id = String(body.id || "");
    const status = String(body.status || "");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Feedback ID is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!["NEW", "REVIEWED", "ACTIONED"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid feedback status",
        },
        {
          status: 400,
        }
      );
    }

    const feedback = await prisma.feedback.updateMany({
      where: {
        id,
        workspaceId: session.workspaceId,
      },
      data: {
        status: status as "NEW" | "REVIEWED" | "ACTIONED",
      },
    });

    return NextResponse.json({
      success: true,
      updated: feedback.count,
    });
  } catch (error) {
    console.error("PATCH /api/feedback error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update feedback",
      },
      {
        status: 500,
      }
    );
  }
}