import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const workspace = await prisma.workspace.findFirst();

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const feedback = await prisma.feedback.updateMany({
      where: {
        id,
        workspaceId: workspace.id,
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({
      success: true,
      updated: feedback.count,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to update feedback" },
      { status: 500 }
    );
  }
}