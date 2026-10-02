"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [document, setDocument] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function uploadDocument() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch("/api/document", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Upload API error:", data);

        throw new Error(data.error || `Upload failed (${response.status})`);
      }

      setDocument(data.text);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function askQuestion() {
    if (!document || !question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document,
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get answer");
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f6f3] px-6 py-16 text-[#302c29]">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#8a7e78]">
            Document Assistant
          </p>

          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
            Ask your document
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#766e69]">
            Upload a document and ask questions about its contents.
          </p>
        </div>

        {/* Upload */}
        <section className="rounded-2xl border border-[#ded8d2] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-serif text-xl">Upload document</h2>
            <p className="mt-1 text-sm text-[#857c76]">
              PDF documents are supported.
            </p>
          </div>

          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#cfc7c0] bg-[#faf9f7] px-6 text-center transition hover:border-[#9c9189] hover:bg-[#f7f4f1]">
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#eee9e4]">
              ↑
            </div>

            <p className="text-sm font-medium">
              {file ? file.name : "Choose a PDF"}
            </p>

            {!file && (
              <p className="mt-1 text-xs text-[#958b84]">
                Click to browse your files
              </p>
            )}
          </label>

          <button
            onClick={uploadDocument}
            disabled={!file || loading}
            className="mt-5 w-full rounded-xl bg-[#302c29] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#49423d] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Processing..." : "Upload document"}
          </button>

          {document && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#f1f5ef] px-4 py-3 text-sm text-[#53604f]">
              <span>✓</span>
              <span>Document ready for questions</span>
            </div>
          )}
        </section>

        {/* Question */}
        {document && (
          <section className="mt-6 rounded-2xl border border-[#ded8d2] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl">Ask a question</h2>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to know about this document?"
              rows={4}
              className="mt-5 w-full resize-none rounded-xl border border-[#d9d2cc] bg-[#faf9f7] px-4 py-3 text-sm outline-none transition placeholder:text-[#aaa09a] focus:border-[#8f847c] focus:ring-2 focus:ring-[#8f847c]/10"
            />

            <button
              onClick={askQuestion}
              disabled={!question.trim() || loading}
              className="mt-4 rounded-xl bg-[#302c29] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#49423d] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Thinking..." : "Ask question"}
            </button>
          </section>
        )}

        {/* Answer */}
        {answer && (
          <section className="mt-6 rounded-2xl border border-[#ded8d2] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eee9e4] text-sm">
                ✦
              </div>

              <h2 className="font-serif text-xl">Answer</h2>
            </div>

            <div className="border-t border-[#eee9e4] pt-5 text-sm leading-7 text-[#514b47]">
              {answer}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
