"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Activity,
  Inbox,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import LogoutButton from "@/components/LogoutButton";

type Feedback = {
  id: string;
  content: string;
  channel: string;
  customerLabel?: string | null;
  sentiment: "POS" | "NEU" | "NEG";
  sentimentScore?: number | null;
  status: "NEW" | "REVIEWED" | "ACTIONED";
  createdAt: string;
};

type DashboardData = {
  success: boolean;
  stats: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
    newCount: number;
    reviewedCount: number;
    actionedCount: number;
  };
  channels: {
    channel: string;
    count: number;
  }[];
  recentFeedback: Feedback[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to load dashboard");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg font-semibold text-slate-500">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="font-semibold text-red-500">
          {error || "Dashboard data unavailable"}
        </p>
      </main>
    );
  }

  const { stats, channels, recentFeedback } = data;

  const sentimentData = [
    { name: "Positive", value: stats.positive },
    { name: "Neutral", value: stats.neutral },
    { name: "Negative", value: stats.negative },
  ];

  const statusData = [
    { name: "New", value: stats.newCount },
    { name: "Reviewed", value: stats.reviewedCount },
    { name: "Actioned", value: stats.actionedCount },
  ];

  const sentimentColors = ["#22c55e", "#94a3b8", "#ef4444"];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-lg">
                <BarChart3 size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-950">
                  LOOP Dashboard
                </h1>

                <p className="text-sm text-slate-500">
                  Customer feedback overview
                </p>
              </div>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-8 py-8">
        {/* KPI CARDS */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Feedback
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {stats.total}
                </p>
              </div>

              <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                <MessageSquare size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Positive
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {stats.positive}
                </p>
              </div>

              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <ThumbsUp size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Negative
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {stats.negative}
                </p>
              </div>

              <div className="rounded-xl bg-red-100 p-3 text-red-600">
                <ThumbsDown size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Neutral
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {stats.neutral}
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Minus size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* SENTIMENT */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-950">
                Sentiment Overview
              </h2>

              <p className="text-sm text-slate-500">
                Customer sentiment distribution
              </p>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {sentimentData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={sentimentColors[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* CHANNELS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-950">
                Feedback by Channel
              </h2>

              <p className="text-sm text-slate-500">
                Where customer feedback comes from
              </p>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channels}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="channel" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    fill="#7c3aed"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* STATUS CARDS */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <Activity className="text-purple-600" size={24} />

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Feedback Workflow
              </h2>

              <p className="text-sm text-slate-500">
                Track feedback processing status
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {statusData.map((item) => (
              <div
                key={item.name}
                className="rounded-xl bg-slate-50 p-5"
              >
                <p className="text-sm font-semibold text-slate-500">
                  {item.name}
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT FEEDBACK */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
            <Inbox className="text-purple-600" size={24} />

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Recent Feedback
              </h2>

              <p className="text-sm text-slate-500">
                Latest customer feedback
              </p>
            </div>

            <a
              href="/inbox"
              className="ml-auto rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              View Inbox
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm text-slate-500">
                  <th className="px-6 py-4">Feedback</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Sentiment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {recentFeedback.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="max-w-[500px] px-6 py-5">
                      <p className="font-medium text-slate-900">
                        {item.content}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.customerLabel || "Anonymous"}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                        {item.channel}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          item.sentiment === "POS"
                            ? "bg-green-100 text-green-700"
                            : item.sentiment === "NEG"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.sentiment === "POS"
                          ? "Positive"
                          : item.sentiment === "NEG"
                            ? "Negative"
                            : "Neutral"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          item.status === "ACTIONED"
                            ? "bg-purple-100 text-purple-700"
                            : item.status === "REVIEWED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}