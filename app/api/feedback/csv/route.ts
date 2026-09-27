import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await requireSession();

    if (!["ADMIN", "ANALYST"].includes(session.role)) {
      return NextResponse.json(
        { error: "You do not have permission to import feedback." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "CSV file is required." },
        { status: 400 }
      );
    }

    const text = await file.text();

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "CSV must contain a header and at least one row." },
        { status: 400 }
      );
    }

    const headers = lines[0]
      .split(",")
      .map((header) => header.trim().toLowerCase());

    const contentIndex = headers.indexOf("content");
    const channelIndex = headers.indexOf("channel");
    const customerIndex = headers.indexOf("customerlabel");

    if (contentIndex === -1 || channelIndex === -1) {
      return NextResponse.json(
        { error: "CSV requires content and channel columns." },
        { status: 400 }
      );
    }

    const data = lines.slice(1).map((line) => {
      const values = line.split(",").map((value) =>
        value.trim().replace(/^"|"$/g, "")
      );

      return {
        content: values[contentIndex],
        channel: values[channelIndex],
        customerLabel:
          customerIndex >= 0
            ? values[customerIndex] || null
            : null,
        sentiment: "NEU" as const,
        status: "NEW" as const,
        workspaceId: session.workspaceId,
      };
    });

    const validData = data.filter(
      (item) => item.content && item.channel
    );

    if (validData.length === 0) {
      return NextResponse.json(
        { error: "No valid feedback rows found." },
        { status: 400 }
      );
    }

    const result = await prisma.feedback.createMany({
      data: validData,
    });

    return NextResponse.json({
      success: true,
      imported: result.count,
    });
  } catch (error) {
    console.error("CSV IMPORT ERROR:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to import CSV" },
      { status: 500 }
    );
  }
}