"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CSVUploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadCSV() {
    if (!file) {
      setMessage("Please select a CSV file.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setMessage("Please select a CSV file.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/feedback/csv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "CSV upload failed");
      }

      setMessage(`${data.imported} feedback items imported successfully.`);

      setTimeout(() => {
        router.push("/inbox");
      }, 1200);
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
          Import CSV
        </h1>

        <p className="mt-3 text-slate-600">
          Upload customer feedback in CSV format.
        </p>

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

          <div className="rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center">
            <div className="text-5xl">📄</div>

            <h2 className="mt-4 text-xl font-bold">
              Choose CSV file
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Required columns: content, channel
            </p>

            <p className="text-sm text-slate-500">
              Optional column: customerLabel
            </p>

            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setMessage("");
              }}
              className="mt-6 block w-full text-sm"
            />

            {file && (
              <p className="mt-4 font-semibold text-purple-700">
                Selected: {file.name}
              </p>
            )}
          </div>

          <button
            onClick={uploadCSV}
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-7 py-4 font-bold text-white disabled:opacity-60"
          >
            {loading ? "Importing..." : "Import Feedback"}
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