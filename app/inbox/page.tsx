"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Filter, Inbox } from "lucide-react";
import { useRouter } from "next/navigation";

type Feedback = {
  id: string;
  content: string;
  channel: string;
  sourceRef?: string | null;
  customerLabel?: string | null;
  sentiment: "POS" | "NEU" | "NEG";
  sentimentScore?: number | null;
  status: "NEW" | "REVIEWED" | "ACTIONED";
  createdAt: string;
};

export default function InboxPage() {
  const router = useRouter();

  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sentiment, setSentiment] = useState("ALL");
  const [error, setError] = useState("");

  async function loadFeedback() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/feedback");

      if (!response.ok) {
        throw new Error("Failed to load feedback");
      }

      const data = await response.json();

      setFeedback(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setError("Failed to load feedback.");
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeedback();
  }, []);

  async function updateStatus(
    id: string,
    newStatus: "NEW" | "REVIEWED" | "ACTIONED"
  ) {
    try {
      const response = await fetch("/api/feedback", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setFeedback((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  }

  const filteredFeedback = useMemo(() => {
    return feedback.filter((item) => {
      const matchesSearch =
        !search ||
        item.content.toLowerCase().includes(search.toLowerCase()) ||
        item.channel.toLowerCase().includes(search.toLowerCase()) ||
        (item.customerLabel || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "ALL" || item.status === status;

      const matchesSentiment =
        sentiment === "ALL" || item.sentiment === sentiment;

      return matchesSearch && matchesStatus && matchesSentiment;
    });
  }, [feedback, search, status, sentiment]);

  function sentimentLabel(value: Feedback["sentiment"]) {
    if (value === "POS") return "Positive";
    if (value === "NEG") return "Negative";
    return "Neutral";
  }

  function sentimentClass(value: Feedback["sentiment"]) {
    if (value === "POS") {
      return "bg-green-100 text-green-700";
    }

    if (value === "NEG") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
  }

  function statusClass(value: Feedback["status"]) {
    if (value === "ACTIONED") {
      return "bg-purple-100 text-purple-700";
    }

    if (value === "REVIEWED") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-amber-100 text-amber-700";
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-8 py-5">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-950">
              <span className="text-purple-600">✧</span>
              Feedback Inbox
            </h1>

            <p className="text-sm text-slate-500">
              Review and manage customer feedback
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-8 py-10">
        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search
              size={21}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search feedback..."
              className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 outline-none focus:border-purple-400"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-14 rounded-xl border border-slate-200 bg-white px-5 outline-none focus:border-purple-400"
          >
            <option value="ALL">All statuses</option>
            <option value="NEW">New</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="ACTIONED">Actioned</option>
          </select>

          <select
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
            className="h-14 rounded-xl border border-slate-200 bg-white px-5 outline-none focus:border-purple-400"
          >
            <option value="ALL">All sentiments</option>
            <option value="POS">Positive</option>
            <option value="NEU">Neutral</option>
            <option value="NEG">Negative</option>
          </select>
        </div>

        {/* Main card */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
            <Filter size={22} className="text-purple-600" />

            <h2 className="text-xl font-bold text-slate-950">
              Customer feedback
            </h2>

            <span className="ml-auto rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700">
              {filteredFeedback.length}
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <p className="font-semibold text-slate-500">
                Loading feedback...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <p className="font-semibold text-red-500">{error}</p>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center">
              <Inbox size={48} className="text-slate-300" />

              <p className="mt-4 text-lg font-bold text-slate-900">
                No feedback found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm text-slate-500">
                    <th className="px-6 py-4 font-semibold">
                      Customer feedback
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Channel
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Customer
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Sentiment
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFeedback.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="max-w-[500px] px-6 py-5">
                        <p className="font-medium leading-6 text-slate-900">
                          {item.content}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                          {item.channel}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {item.customerLabel || "Anonymous"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${sentimentClass(
                            item.sentiment
                          )}`}
                        >
                          {sentimentLabel(item.sentiment)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            updateStatus(
                              item.id,
                              e.target.value as Feedback["status"]
                            )
                          }
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-bold outline-none ${statusClass(
                            item.status
                          )}`}
                        >
                          <option value="NEW">New</option>
                          <option value="REVIEWED">Reviewed</option>
                          <option value="ACTIONED">Actioned</option>
                        </select>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}