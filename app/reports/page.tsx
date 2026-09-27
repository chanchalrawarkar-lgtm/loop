"use client";

import { useEffect, useState } from "react";

type Report = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function loadReports() {
    try {
      const response = await fetch("/api/reports");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load reports");
      }

      setReports(data.reports || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateReport() {
    setGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate report");
      }

      setReports((current) => [data.report, ...current]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate report"
      );
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
              Customer Intelligence
            </p>

            <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-950">
              Voice of Customer
            </h1>

            <p className="mt-3 text-lg text-slate-600">
              Turn customer feedback into an executive-ready report.
            </p>
          </div>

          <button
            onClick={generateReport}
            disabled={generating}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-bold text-white shadow-lg disabled:opacity-60"
          >
            {generating ? "Generating..." : "Generate Report"}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <b>Something went wrong</b>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="text-5xl">📊</div>

            <h2 className="mt-4 text-2xl font-bold text-slate-950">
              No reports yet
            </h2>

            <p className="mt-2 text-slate-600">
              Generate your first Voice of Customer report.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <article
                key={report.id}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-2xl font-bold text-slate-950">
                    {report.title}
                  </h2>

                  <span className="text-sm text-slate-500">
                    {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="whitespace-pre-line rounded-2xl bg-slate-50 p-6 leading-7 text-slate-700">
                  {report.content}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}