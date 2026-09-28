"use client";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Database,
  FileText,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Feedback Classification",
    description:
      "Automatically understand customer feedback with AI-powered sentiment and theme detection.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Visualize feedback volume, sentiment, trends and customer themes in one place.",
  },
  {
    icon: Search,
    title: "Feedback Explorer",
    description:
      "Search, filter and explore feedback across channels with powerful controls.",
  },
  {
    icon: MessageSquare,
    title: "Ask LOOP",
    description:
      "Ask questions about your customers and get grounded answers from real feedback.",
  },
  {
    icon: TrendingUp,
    title: "Trend Detection",
    description:
      "Discover emerging themes, sentiment shifts and recurring customer issues.",
  },
  {
    icon: FileText,
    title: "Voice of Customer",
    description:
      "Generate insightful reports with key themes, customer quotes and recommendations.",
  },
];

const feedback = [
  {
    customer: "Sarah K.",
    text: "The app is easy to use and the support team is really helpful.",
    sentiment: "Positive",
    theme: "Usability",
  },
  {
    customer: "Michael J.",
    text: "Pricing is too high compared to similar products.",
    sentiment: "Negative",
    theme: "Pricing",
  },
  {
    customer: "Priya R.",
    text: "The new dashboard looks beautiful and loads much faster.",
    sentiment: "Positive",
    theme: "Features",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute right-[-120px] top-[-80px] h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute left-1/2 top-[650px] h-72 w-72 -translate-x-1/2 rounded-full bg-purple-100/40 blur-3xl" />
      </div>

      {/* NAVBAR */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-xl font-bold text-white shadow-lg shadow-violet-200">
            ∞
          </div>

          <span className="text-2xl font-bold tracking-tight text-slate-900">
            LOOP
          </span>
        </div>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-violet-600">
            Features
          </a>

          <a href="#how-it-works" className="transition hover:text-violet-600">
            How It Works
          </a>

          <a href="#analytics" className="transition hover:text-violet-600">
            Analytics
          </a>

          <a href="#ask-loop" className="transition hover:text-violet-600">
            Ask LOOP
          </a>

          <a href="#reports" className="transition hover:text-violet-600">
            Reports
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:block">
           <Link
  href="/login"
  className="..."
>
  Sign In
</Link>
          </button>

          <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl">
           <Link
  href="/login"
  className="..."
>
  Get Started →
</Link>
            <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-14 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
            <Sparkles size={15} />
            AI-Powered Customer Feedback Intelligence
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">
            Turn Customer Feedback
            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Into Actionable Insights.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            LOOP helps you collect, analyze and understand customer feedback
            using AI — so your team can make smarter decisions and build
            better products.
          </p>

          <div className="mt-7 flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={18} />
              AI-Powered Analysis
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={18} />
              Real-Time Insights
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={18} />
              Multi-Channel Feedback
            </span>
          </div>

          <div className="mt-9 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-violet-200 transition hover:-translate-y-1">
             <Link
  href="/login"
  className="..."
>
  Get Started Free →
</Link>
              <ArrowRight size={18} />
            </button>

            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50">
              <Sparkles size={17} />
             <Link
  href="/dashboard"
  className="..."
>
  Explore Dashboard
</Link>
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["SK", "MJ", "PR", "AD"].map((item) => (
                <div
                  key={item}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold text-white"
                >
                  {item}
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Built for modern teams
              </p>
              <p className="text-xs text-slate-500">
                Customer insights made simple
              </p>
            </div>
          </div>
        </div>

        {/* DASHBOARD PREVIEW */}
        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-violet-300/30 via-blue-300/20 to-purple-300/30 blur-2xl" />

          <div className="relative rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70">
            {/* Fake browser top */}
            <div className="flex items-center justify-between border-b border-slate-100 px-3 pb-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
              </div>

              <div className="rounded-lg bg-slate-50 px-5 py-1.5 text-[10px] text-slate-400">
                app.loop.ai/dashboard
              </div>

              <div />
            </div>

            <div className="grid grid-cols-[105px_1fr] gap-3 p-3">
              {/* Mini sidebar */}
              <div className="hidden rounded-2xl bg-slate-50 p-2 sm:block">
                <div className="mb-5 flex items-center gap-1.5 px-2 pt-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-600 text-xs text-white">
                    ∞
                  </div>
                  <span className="text-xs font-bold">LOOP</span>
                </div>

                {["Dashboard", "Feedback", "Analytics", "Ask LOOP", "Reports"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className={`mb-1 rounded-lg px-2 py-2 text-[9px] ${
                        index === 0
                          ? "bg-violet-100 font-semibold text-violet-700"
                          : "text-slate-500"
                      }`}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>

              {/* Mini dashboard */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-slate-400">
                      Customer Insights
                    </p>
                    <h3 className="text-sm font-bold text-slate-800">
                      Dashboard
                    </h3>
                  </div>

                  <div className="rounded-lg border border-slate-100 px-2 py-1 text-[8px] text-slate-400">
                    Last 7 days
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                  {[
                    ["2,482", "Total Feedback"],
                    ["68%", "Positive"],
                    ["12%", "Negative"],
                    ["2.4d", "Avg. Resolution"],
                  ].map(([value, label], index) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-100 bg-white p-2 shadow-sm"
                    >
                      <p className="text-[13px] font-bold text-slate-800">
                        {value}
                      </p>
                      <p
                        className={`text-[7px] ${
                          index === 2 ? "text-red-400" : "text-slate-400"
                        }`}
                      >
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-2 grid gap-2 sm:grid-cols-[1.5fr_1fr]">
                  <div className="rounded-xl border border-slate-100 p-3">
                    <div className="mb-2 flex justify-between">
                      <p className="text-[9px] font-semibold">
                        Feedback Volume
                      </p>
                      <TrendingUp size={11} className="text-violet-500" />
                    </div>

                    <div className="relative h-28 overflow-hidden">
                      <div className="absolute bottom-4 left-0 right-0 h-px bg-slate-100" />
                      <div className="absolute bottom-10 left-0 right-0 h-px bg-slate-100" />
                      <div className="absolute bottom-16 left-0 right-0 h-px bg-slate-100" />

                      <svg
                        viewBox="0 0 400 130"
                        className="absolute inset-0 h-full w-full"
                      >
                        <polyline
                          fill="none"
                          stroke="#7c3aed"
                          strokeWidth="4"
                          points="0,100 55,78 110,88 165,45 220,62 275,30 330,48 400,18"
                        />
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          points="0,112 55,105 110,110 165,84 220,92 275,72 330,81 400,60"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 p-3">
                    <p className="text-[9px] font-semibold">
                      Sentiment
                    </p>

                    <div className="flex items-center justify-center py-3">
                      <div className="relative h-20 w-20 rounded-full bg-[conic-gradient(#22c55e_0_68%,#60a5fa_68%_88%,#fb7185_88%_100%)]">
                        <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white text-[10px] font-bold">
                          2,482
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-2 text-[7px]">
                      <span className="text-emerald-500">● Positive</span>
                      <span className="text-blue-500">● Neutral</span>
                      <span className="text-red-400">● Negative</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 rounded-xl border border-slate-100 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[9px] font-semibold">
                      Top Feedback Themes
                    </p>
                    <span className="text-[8px] text-violet-500">
                      View all
                    </span>
                  </div>

                  {[
                    ["Product Quality", "27%"],
                    ["Customer Support", "18%"],
                    ["Pricing", "14%"],
                    ["Features", "12%"],
                  ].map(([theme, percent]) => (
                    <div key={theme} className="mb-2">
                      <div className="flex justify-between text-[8px]">
                        <span className="text-slate-500">{theme}</span>
                        <span className="font-semibold">{percent}</span>
                      </div>

                      <div className="mt-1 h-1 rounded-full bg-slate-100">
                        <div
                          className="h-1 rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                          style={{ width: percent }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ask LOOP floating card */}
            <div className="absolute -bottom-5 -right-5 hidden w-48 rounded-2xl border border-violet-100 bg-white p-3 shadow-xl sm:block">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Sparkles size={15} />
                </div>

                <div>
                  <p className="text-[9px] font-bold">Ask LOOP</p>
                  <p className="text-[8px] text-slate-400">
                    AI Customer Insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-100 bg-slate-50/70">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-slate-200 px-6 py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center justify-center gap-3 py-3">
            <Database className="text-violet-600" size={22} />
            <div>
              <p className="text-2xl font-bold">120+</p>
              <p className="text-xs text-slate-500">Feedback Analyzed</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-3">
            <Sparkles className="text-violet-600" size={22} />
            <div>
              <p className="text-2xl font-bold">6</p>
              <p className="text-xs text-slate-500">AI Themes Identified</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-3">
            <Zap className="text-violet-600" size={22} />
            <div>
              <p className="text-2xl font-bold">AI</p>
              <p className="text-xs text-slate-500">Powered Insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
            Powerful Features
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            Everything you need to understand your customers
          </h2>

          <p className="mt-4 text-slate-500">
            From raw feedback to AI-powered insights, LOOP gives your team the
            complete picture.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <ChevronRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-500"
                  />
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="border-y border-slate-100 bg-slate-50/70"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
              Simple Process
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              How LOOP Works
            </h2>

            <p className="mt-4 text-slate-500">
              From raw feedback to meaningful action in four simple steps.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {[
              {
                number: "01",
                icon: Upload,
                title: "Collect Feedback",
                text: "Bring feedback from support tickets, reviews, surveys and more.",
              },
              {
                number: "02",
                icon: Brain,
                title: "AI Understands It",
                text: "LOOP classifies sentiment and identifies meaningful themes.",
              },
              {
                number: "03",
                icon: TrendingUp,
                title: "Find Trends",
                text: "Discover patterns, emerging issues and sentiment changes.",
              },
              {
                number: "04",
                icon: Zap,
                title: "Take Action",
                text: "Turn customer insights into better product decisions.",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <span className="text-xs font-bold text-violet-500">
                    {step.number}
                  </span>

                  <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-4 font-bold">{step.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ANALYTICS */}
      <section id="analytics" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
              Real-Time Insights
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              A powerful dashboard for smarter decisions.
            </h2>

            <p className="mt-5 leading-7 text-slate-500">
              See what customers are saying at a glance with interactive
              analytics, sentiment trends and top feedback themes.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Interactive feedback analytics",
                "Sentiment and theme analysis",
                "Filter insights by date and channel",
                "Actionable customer intelligence",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={19}
                    className="text-emerald-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <button className="mt-8 flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700">
              <Link
  href="/dashboard"
  className="..."
>
  Explore Dashboard
</Link>
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Overview</p>
                <h3 className="font-bold">Customer Insights</h3>
              </div>

              <div className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-600">
                Last 30 days
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ["2,482", "Feedback"],
                ["68%", "Positive"],
                ["12%", "Negative"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl bg-slate-50 p-4"
                >
                  <p className="text-xl font-bold">{value}</p>
                  <p className="mt-1 text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-slate-100 p-4">
              <div className="mb-4 flex justify-between">
                <p className="text-sm font-bold">Feedback Volume</p>
                <TrendingUp size={18} className="text-violet-500" />
              </div>

              <div className="h-40">
                <svg
                  viewBox="0 0 600 180"
                  className="h-full w-full"
                >
                  <line
                    x1="0"
                    y1="145"
                    x2="600"
                    y2="145"
                    stroke="#e2e8f0"
                  />
                  <line
                    x1="0"
                    y1="100"
                    x2="600"
                    y2="100"
                    stroke="#e2e8f0"
                  />
                  <line
                    x1="0"
                    y1="55"
                    x2="600"
                    y2="55"
                    stroke="#e2e8f0"
                  />

                  <polyline
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="5"
                    points="0,135 80,105 150,118 230,65 300,80 375,45 450,63 520,32 600,48"
                  />

                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    points="0,155 80,140 150,148 230,115 300,125 375,100 450,110 520,82 600,92"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ASK LOOP */}
      <section
        id="ask-loop"
        className="relative overflow-hidden bg-slate-950"
      >
        <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
                <Sparkles size={15} />
                AI Assistant
              </div>

              <h2 className="text-4xl font-bold text-white">
                Have a question about your customers?
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                Ask LOOP anything about your customer feedback and get instant,
                grounded answers based on your real data.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <div className="rounded-2xl bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <Sparkles size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold">Ask LOOP</p>
                    <p className="text-xs text-slate-400">
                      Customer Feedback AI
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                  <Search size={17} className="text-slate-400" />

                  <span className="flex-1 text-sm text-slate-400">
                    What are customers complaining about most?
                  </span>

                  <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white"><Link href="/ask">
  
                   <ArrowRight size={16} /></Link> 
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-violet-50 p-4 text-sm leading-6 text-slate-600">
                  <span className="font-semibold text-violet-700">
                    LOOP AI:
                  </span>{" "}
                  Customers are most frequently mentioning product quality,
                  customer support and pricing.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
            Feedback Explorer
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Every customer voice in one place.
          </h2>

          <p className="mt-4 text-slate-500">
            Search, filter and understand feedback with a clean workflow.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
            <div>
              <h3 className="font-bold">Recent Feedback</h3>
              <p className="mt-1 text-xs text-slate-400">
                Latest customer feedback
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">
              <Search size={14} />
              <Link
  href="/feedback"
  className="..."
>
  Search Feedback
</Link>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {feedback.map((item) => (
              <div
                key={item.customer}
                className="grid gap-3 p-5 sm:grid-cols-[120px_1fr_100px_100px] sm:items-center"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600">
                    {item.customer.slice(0, 2)}
                  </div>

                  <span className="text-sm font-semibold">
                    {item.customer}
                  </span>
                </div>

                <p className="text-sm text-slate-500">{item.text}</p>

                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                    item.sentiment === "Positive"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {item.sentiment}
                </span>

                <span className="w-fit rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-600">
                  {item.theme}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REPORTS */}
      <section
        id="reports"
        className="border-y border-slate-100 bg-slate-50/70"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
                Voice of Customer
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                Turn feedback into a clear customer story.
              </h2>

              <p className="mt-5 leading-7 text-slate-500">
                Generate reports that summarize key themes, sentiment shifts,
                customer quotes and recommended actions.
              </p>

              <button className="mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-200">
                <Link
  href="/reports"
  className="..."
>
  Generate Report
</Link>
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs text-slate-400">LOOP Report</p>
                  <h3 className="font-bold">Customer Insights</h3>
                </div>

                <FileText className="text-violet-500" size={22} />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-violet-50 p-4">
                  <p className="text-xs text-violet-500">Top Theme</p>
                  <p className="mt-2 font-bold">Product Quality</p>
                  <p className="mt-1 text-xs text-slate-500">
                    27% of feedback
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs text-emerald-600">
                    Sentiment
                  </p>
                  <p className="mt-2 font-bold">68% Positive</p>
                  <p className="mt-1 text-xs text-slate-500">
                    +8% vs last period
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-semibold">
                  Recommended Actions
                </p>

                <div className="mt-3 space-y-3">
                  {[
                    "Improve product quality documentation",
                    "Reduce support response time",
                    "Review pricing feedback",
                  ].map((action) => (
                    <div
                      key={action}
                      className="flex items-center gap-2 text-xs text-slate-500"
                    >
                      <CheckCircle2 size={14} className="text-violet-500" />
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_25%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_25%)]" />

        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl text-white backdrop-blur">
            ∞
          </div>

          <h2 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
            Close the loop on customer feedback.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-7 text-violet-100">
            Understand what your customers are saying, discover what matters
            and turn insights into better decisions.
          </p>

          <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-violet-700 shadow-xl transition hover:-translate-y-1">
            <Link
  href="/login"
  className="..."
>
  Get Started with LOOP
</Link>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 font-bold">
                  ∞
                </div>

                <span className="text-xl font-bold">LOOP</span>
              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                AI-powered customer feedback intelligence for teams that want
                to listen, understand and act.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Product</h4>

              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <p><section id="features">Features</section></p>
                <p><Link href="/trends">
  Analytics
</Link></p>
                <p><Link href="/ask">
  Ask LOOP
</Link></p>
                <p><Link href="/reports">
  Reports
</Link></p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold">Company</h4>

              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <p>About</p>
                <p>Documentation</p>
                <p>GitHub</p>
                <p>Contact</p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
            © 2026 LOOP. Close the loop on customer feedback.
          </div>
        </div>
      </footer>
    </main>
  );
}