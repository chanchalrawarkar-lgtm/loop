import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { canManageFeedback } from "@/lib/permissions";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  try {
    const session = await requireSession();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const sentiment = searchParams.get("sentiment") || "";

    const feedback = await prisma.feedback.findMany({
      where: {
        workspaceId: session.workspaceId,
        ...(search
          ? {
              content: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {}),
        ...(status ? { status: status as any } : {}),
        ...(sentiment ? { sentiment: sentiment as any } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("FEEDBACK GET ERROR:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to load feedback" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    if (!canManageFeedback(session)) {
  return NextResponse.json(
    { error: "Forbidden" },
    { status: 403 }
  );
}
    const body = await request.json();

    if (!body.content || !body.channel) {
      return NextResponse.json(
        { error: "Content and channel are required." },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        content: body.content,
        channel: body.channel,
        customerLabel: body.customerLabel || null,
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
    console.error("FEEDBACK POST ERROR:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create feedback" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();

    const allowedStatuses = ["NEW", "REVIEWED", "ACTIONED"];

    if (!body.id || !allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid feedback update." },
        { status: 400 }
      );
    }

    const existing = await prisma.feedback.findFirst({
      where: {
        id: body.id,
        workspaceId: session.workspaceId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Feedback not found." },
        { status: 404 }
      );
    }

    const feedback = await prisma.feedback.update({
      where: {
        id: body.id,
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("FEEDBACK PATCH ERROR:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update feedback" },
      { status: 500 }
    );
  }
}