import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { canManageFeedback } from "@/lib/permissions";

export const dynamic = "force-dynamic";

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
    console.error("GET_FEEDBACK_ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load feedback." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();

    if (!canManageFeedback(session)) {
      return NextResponse.json(
        { error: "You do not have permission to add feedback." },
        { status: 403 }
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
        { error: "Feedback content is required." },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        content,
        channel,
        customerLabel,
        workspaceId: session.workspaceId,
        status: "NEW",
        sentiment: "NEU",
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("POST_FEEDBACK_ERROR:", error);

    return NextResponse.json(
      { error: "Unable to create feedback." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession();

    if (!canManageFeedback(session)) {
      return NextResponse.json(
        { error: "You do not have permission to update feedback." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const id = String(body.id || "");
    const status = String(body.status || "");

    if (!id) {
      return NextResponse.json(
        { error: "Feedback id is required." },
        { status: 400 }
      );
    }

    if (!["NEW", "REVIEWED", "ACTIONED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid feedback status." },
        { status: 400 }
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
    console.error("PATCH_FEEDBACK_ERROR:", error);

    return NextResponse.json(
      { error: "Unable to update feedback." },
      { status: 500 }
    );
  }
}