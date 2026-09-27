"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SimulateFeedbackPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function simulateFeedback() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/feedback/simulate", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to simulate feedback");
      }

      setMessage("New simulated feedback added successfully.");

      setTimeout(() => {
        router.push("/inbox");
      }, 1000);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
          Feedback Ingestion
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-950">
          Simulate Customer Feedback
        </h1>

        <p className="mt-3 text-slate-600">
          Generate sample customer feedback to test the LOOP ingestion workflow.
        </p>

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-8 text-center">
            <div className="text-5xl">⚡</div>

            <h2 className="mt-4 text-2xl font-bold text-slate-950">
              Simulated Channel
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Click the button below to generate one realistic customer
              feedback item and add it to your workspace.
            </p>
          </div>

          <button
            onClick={simulateFeedback}
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-7 py-4 font-bold text-white disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Feedback"}
          </button>

          {message && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-center font-semibold text-slate-700">
              {message}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}