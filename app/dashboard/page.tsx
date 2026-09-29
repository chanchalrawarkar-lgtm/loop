"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Minus,
  ArrowRight,
  LogOut,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Feedback = {
  id: string;
  content: string;
  channel: string;
  customerLabel?: string | null;
  sentiment: "POS" | "NEG" | "NEU";
  status: "NEW" | "REVIEWED" | "ACTIONED";
  createdAt: string;
};

type DashboardStats = {
  totalFeedback: number;
  positive: number;
  negative: number;
  neutral: number;
  status: {
    new: number;
    reviewed: number;
    actioned: number;
  };
  recentFeedback: Feedback[];
};

const emptyStats: DashboardStats = {
  totalFeedback: 0,
  positive: 0,
  negative: 0,
  neutral: 0,
  status: {
    new: 0,
    reviewed: 0,
    actioned: 0,
  },
  recentFeedback: [],
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/dashboard", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load dashboard");
      }

      setStats({
        totalFeedback: data.totalFeedback ?? 0,
        positive: data.positive ?? 0,
        negative: data.negative ?? 0,
        neutral: data.neutral ?? 0,
        status: {
          new: data.status?.new ?? 0,
          reviewed: data.status?.reviewed ?? 0,
          actioned: data.status?.actioned ?? 0,
        },
        recentFeedback: Array.isArray(data.recentFeedback)
          ? data.recentFeedback
          : [],
      });
    } catch (err) {
      console.error("DASHBOARD_LOAD_ERROR:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  const sentimentData = [
    { name: "Positive", value: stats.positive },
    { name: "Neutral", value: stats.neutral },
    { name: "Negative", value: stats.negative },
  ];

  const channelMap: Record<string, number> = {};

  stats.recentFeedback.forEach((item) => {
    channelMap[item.channel] = (channelMap[item.channel] || 0) + 1;
  });

  const channelData = Object.entries(channelMap).map(([name, value]) => ({
    name,
    value,
  }));

  const statusData = [
    { name: "New", value: stats.status.new },
    { name: "Reviewed", value: stats.status.reviewed },
    { name: "Actioned", value: stats.status.actioned },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between px-5 py-5 md:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg">
              <BarChart3 size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-950 md:text-3xl">
                LOOP Dashboard
              </h1>
              <p className="text-sm text-slate-500 md:text-base">
                Customer feedback overview
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-600"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-7 p-5 md:p-8">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <section className="grid gap-6 md:grid-cols-2">
          <StatCard
            title="Total Feedback"
            value={stats.totalFeedback}
            icon={<MessageSquare size={28} />}
            iconClass="bg-violet-100 text-violet-600"
            borderClass="border-violet-100"
          />

          <StatCard
            title="Positive"
            value={stats.positive}
            icon={<ThumbsUp size={28} />}
            iconClass="bg-emerald-100 text-emerald-600"
            valueClass="text-emerald-600"
            borderClass="border-emerald-100"
          />

          <StatCard
            title="Negative"
            value={stats.negative}
            icon={<ThumbsDown size={28} />}
            iconClass="bg-red-100 text-red-600"
            valueClass="text-red-600"
            borderClass="border-red-100"
          />

          <StatCard
            title="Neutral"
            value={stats.neutral}
            icon={<Minus size={28} />}
            iconClass="bg-blue-100 text-blue-600"
            valueClass="text-blue-600"
            borderClass="border-blue-100"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Sentiment Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Customer sentiment distribution
            </p>

            <div className="mt-6 h-72">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Loading...
                </div>
              ) : stats.totalFeedback === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No feedback yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === "Positive"
                              ? "#22c55e"
                              : entry.name === "Negative"
                                ? "#ef4444"
                                : "#3b82f6"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Feedback by Channel
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Where customer feedback comes from
            </p>

            <div className="mt-6 h-72">
              {channelData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No feedback yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Recent Feedback
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest customer feedback from your workspace
              </p>
            </div>

            <Link
              href="/inbox"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
            >
              View Inbox
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            {stats.recentFeedback.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                No feedback yet.
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-3">Feedback</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Sentiment</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {stats.recentFeedback.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="max-w-md px-4 py-4 text-sm font-medium text-slate-700">
                        {item.content}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {item.channel}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            item.sentiment === "POS"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.sentiment === "NEG"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.sentiment}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 p-7 text-white shadow-xl">
            <h2 className="text-2xl font-black">Ask LOOP</h2>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Ask questions about your customer feedback and get useful
              insights.
            </p>

            <Link
              href="/ask"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 transition hover:bg-slate-100"
            >
              Ask a question
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Feedback Status
            </h2>

            <div className="mt-5 space-y-4">
              <StatusRow label="New" value={stats.status.new} />
              <StatusRow label="Reviewed" value={stats.status.reviewed} />
              <StatusRow label="Actioned" value={stats.status.actioned} />
            </div>
          </div>
        </section>

        <div className="flex justify-center pb-8">
          <button
            onClick={loadDashboard}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-violet-300 hover:text-violet-600"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconClass,
  valueClass = "text-slate-950",
  borderClass,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  valueClass?: string;
  borderClass: string;
}) {
  return (
    <div
      className={`rounded-3xl border bg-white p-7 shadow-sm ${borderClass}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <p className={`mt-3 text-4xl font-black ${valueClass}`}>{value}</p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <span className="text-lg font-black text-slate-950">{value}</span>
    </div>
  );
}