import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireSession();

    const workspaceId = session.workspaceId;

    const [
      totalFeedback,
      positive,
      negative,
      neutral,
      newCount,
      reviewedCount,
      actionedCount,
      recentFeedback,
    ] = await Promise.all([
      prisma.feedback.count({
        where: { workspaceId },
      }),

      prisma.feedback.count({
        where: {
          workspaceId,
          sentiment: "POS",
        },
      }),

      prisma.feedback.count({
        where: {
          workspaceId,
          sentiment: "NEG",
        },
      }),

      prisma.feedback.count({
        where: {
          workspaceId,
          sentiment: "NEU",
        },
      }),

      prisma.feedback.count({
        where: {
          workspaceId,
          status: "NEW",
        },
      }),

      prisma.feedback.count({
        where: {
          workspaceId,
          status: "REVIEWED",
        },
      }),

      prisma.feedback.count({
        where: {
          workspaceId,
          status: "ACTIONED",
        },
      }),

      prisma.feedback.findMany({
        where: {
          workspaceId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        workspaceId,
        totalFeedback,
        positive,
        negative,
        neutral,
        status: {
          new: newCount,
          reviewed: reviewedCount,
          actioned: actionedCount,
        },
        recentFeedback,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("DASHBOARD_ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load dashboard data." },
      { status: 500 }
    );
  }
}