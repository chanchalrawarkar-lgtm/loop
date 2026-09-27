import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { canManageSettings } from "@/lib/permissions";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (!canManageSettings(session)) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
            🔒
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-950">
            Access denied
          </h1>

          <p className="mt-2 text-slate-500">
            Only workspace administrators can access Settings.
          </p>

          <a
            href="/dashboard"
            className="mt-6 inline-flex rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Back to Dashboard
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your LOOP workspace settings
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Workspace
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Workspace administration options
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-purple-50 p-5">
              <p className="text-sm font-semibold text-purple-700">
                Current role
              </p>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {session.role}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-700">
                Workspace ID
              </p>

              <p className="mt-2 break-all text-sm font-medium text-slate-800">
                {session.workspaceId}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}