"use client";

import { useState } from "react";

export default function AskPage() {
  const [question, setQuestion] = useState(
    "What are users saying about onboarding?"
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function askLoop() {
    setLoading(true);
    setAnswer("");
    setFeedback([]);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate answer");
      }

      setAnswer(data.answer || "");
      setFeedback(data.supportingFeedback || []);
      setNotice(data.notice || "");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
            AI CUSTOMER INTELLIGENCE
          </p>

          <h1 className="mt-2 text-5xl font-bold text-slate-950">
            Ask LOOP
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Ask questions about your customer feedback and get
            evidence-grounded answers.
          </p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <label className="mb-3 block font-bold text-slate-800">
            Your question
          </label>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
            className="w-full rounded-2xl border border-slate-300 p-5 text-lg outline-none focus:border-purple-500"
          />

          <button
            onClick={askLoop}
            disabled={loading}
            className="mt-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-bold text-white"
          >
            {loading ? "LOOP is thinking..." : "Ask LOOP"}
          </button>

        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <b>Something went wrong:</b>
            <p className="mt-2">{error}</p>
          </div>
        )}

        {notice && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
            <b>Notice</b>
            <p className="mt-2">{notice}</p>
          </div>
        )}

        {answer && (
          <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">
              ✦ LOOP Answer
            </h2>

            <div className="whitespace-pre-line rounded-2xl bg-slate-50 p-6 leading-7">
              {answer}
            </div>
          </section>
        )}

        {feedback.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">
              Supporting Feedback
            </h2>

            <div className="space-y-4">
              {feedback.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex justify-between">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                      Feedback {index + 1}
                    </span>

                    <span className="text-xs font-semibold uppercase">
                      {item.channel}
                    </span>
                  </div>

                  <p className="leading-7 text-slate-700">
                    {item.content}
                  </p>

                  <div className="mt-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                      {item.sentiment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}