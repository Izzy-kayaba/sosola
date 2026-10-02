import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file was uploaded" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    const pdf = await getDocumentProxy(
      new Uint8Array(buffer)
    );

    const { text } = await extractText(pdf, {
      mergePages: true,
    });

    return NextResponse.json({
      success: true,
      filename: file.name,
      text,
    });
  } catch (error) {
    console.error("DOCUMENT PROCESSING ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process document",
      },
      { status: 500 }
    );
  }
}
