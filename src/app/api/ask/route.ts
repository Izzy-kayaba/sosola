import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { document, question } = await request.json();

    if (!document) {
      return NextResponse.json(
        { error: "No document provided" },
        { status: 400 },
      );
    }

    if (!question?.trim()) {
      return NextResponse.json(
        { error: "No question provided" },
        { status: 400 },
      );
    }

    console.log("Question:", question);
    console.log("Document characters:", document.length);

    const response = await openai.responses.create({
      model: "gpt-5",
      instructions:
        "Answer the user's question using only the provided document. If the answer cannot be found in the document, clearly say that the document does not contain enough information to answer the question.",
      input: `
DOCUMENT:

${document}

QUESTION:

${question}
      `,
    });

    return NextResponse.json({
      success: true,
      answer: response.output_text,
    });
  } catch (error) {
    console.error("ASK API ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to answer question",
      },
      { status: 500 },
    );
  }
}
