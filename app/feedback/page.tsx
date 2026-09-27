"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddFeedbackPage() {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("Support");
  const [customerLabel, setCustomerLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submitFeedback() {
    if (!content.trim()) {
      setMessage("Please enter feedback.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          channel,
          customerLabel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add feedback");
      }

      setMessage("Feedback added successfully!");

      setContent("");
      setCustomerLabel("");

      setTimeout(() => {
        router.push("/inbox");
      }, 800);
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
          Add Customer Feedback
        </h1>

        <p className="mt-3 text-slate-600">
          Add a customer comment manually to your LOOP workspace.
        </p>

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

          <label className="font-bold text-slate-800">
            Feedback
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Example: The onboarding process is confusing and takes too long."
            className="mt-3 w-full rounded-2xl border border-slate-300 p-4 outline-none focus:border-purple-500"
          />

          <label className="mt-6 block font-bold text-slate-800">
            Channel
          </label>

          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-300 p-3"
          >
            <option>Support</option>
            <option>Survey</option>
            <option>Review</option>
            <option>Email</option>
            <option>Chat</option>
            <option>Other</option>
          </select>

          <label className="mt-6 block font-bold text-slate-800">
            Customer
          </label>

          <input
            value={customerLabel}
            onChange={(e) => setCustomerLabel(e.target.value)}
            placeholder="Customer name or label"
            className="mt-3 w-full rounded-xl border border-slate-300 p-3"
          />

          <button
            onClick={submitFeedback}
            disabled={loading}
            className="mt-7 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-7 py-3 font-bold text-white disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Feedback"}
          </button>

          {message && (
            <p className="mt-4 font-semibold text-slate-700">
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}