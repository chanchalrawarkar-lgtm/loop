"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Hash,
  MessageSquare,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRouter } from "next/navigation";

type TrendsData = {
  total: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  channels: {
    channel: string;
    count: number;
  }[];
  keywords: {
    word: string;
    count: number;
  }[];
  timeline: {
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
};

export default function TrendsPage() {
  const router = useRouter();

  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadTrends() {
    try {
      setLoading(true);

      const response = await fetch("/api/trends");

      if (!response.ok) {
        throw new Error("Failed to load trends");
      }

      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrends();
  }, []);

  const sentimentTotal = useMemo(() => {
    if (!data) return 0;

    return (
      data.sentiment.positive +
      data.sentiment.neutral +
      data.sentiment.negative
    );
  }, [data]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="mx-auto animate-spin text-purple-600"
          />

          <p className="mt-4 font-semibold text-slate-600">
            Loading trends...
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <p className="font-bold text-red-500">
            Failed to load trends.
          </p>

          <button
            onClick={loadTrends}
            className="mt-4 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              <ArrowLeft size={22} />
            </button>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
                LOOP Analytics
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-950">
                Trends & Insights
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Understand what customers are saying
              </p>
            </div>
          </div>

          <button
            onClick={loadTrends}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-8 py-8">
        {/* Summary cards */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 p-6 text-white shadow-lg">
            <MessageSquare size={28} />

            <p className="mt-6 text-sm text-purple-100">
              Total Feedback
            </p>

            <p className="mt-1 text-4xl font-bold">
              {data.total}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-green-100 p-3 w-fit text-green-600">
              <TrendingUp size={24} />
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Positive
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-950">
              {data.sentiment.positive}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-slate-100 p-3 w-fit text-slate-600">
              <BarChart3 size={24} />
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Neutral
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-950">
              {data.sentiment.neutral}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-red-100 p-3 w-fit text-red-600">
              <TrendingUp size={24} />
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Negative
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-950">
              {data.sentiment.negative}
            </p>
          </div>
        </div>

        {/* Sentiment + Channels */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Sentiment Distribution
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {sentimentTotal} feedback items analyzed
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-green-600">Positive</span>
                  <span>{data.sentiment.positive}</span>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width:
                        sentimentTotal === 0
                          ? "0%"
                          : `${(data.sentiment.positive / sentimentTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-600">Neutral</span>
                  <span>{data.sentiment.neutral}</span>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-400"
                    style={{
                      width:
                        sentimentTotal === 0
                          ? "0%"
                          : `${(data.sentiment.neutral / sentimentTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-red-600">Negative</span>
                  <span>{data.sentiment.negative}</span>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width:
                        sentimentTotal === 0
                          ? "0%"
                          : `${(data.sentiment.negative / sentimentTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Feedback by Channel
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Distribution across customer channels
            </p>

            <div className="mt-5 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.channels}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="channel" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Timeline */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            Sentiment Over Time
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Daily sentiment distribution
          </p>

          <div className="mt-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeline}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="Positive"
                />

                <Line
                  type="monotone"
                  dataKey="neutral"
                  stroke="#64748b"
                  strokeWidth={3}
                  name="Neutral"
                />

                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Negative"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Keywords */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-pink-100 p-3 text-pink-600">
              <Hash size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Top Keywords
              </h2>

              <p className="text-sm text-slate-500">
                Frequently mentioned words in customer feedback
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {data.keywords.length > 0 ? (
              data.keywords.map((keyword) => (
                <span
                  key={keyword.word}
                  className="rounded-full bg-purple-50 px-4 py-2 font-semibold text-purple-700"
                >
                  #{keyword.word}{" "}
                  <span className="text-purple-400">
                    {keyword.count}
                  </span>
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                Not enough data for keywords yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}