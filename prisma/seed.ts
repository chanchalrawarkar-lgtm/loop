import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const feedbackTexts = [
  "The checkout process is too slow on mobile.",
  "I love how quickly the dashboard loads.",
  "The new search feature is very useful.",
  "It was difficult to find my invoices.",
  "Customer support solved my issue quickly.",
  "The export button does not work sometimes.",
  "The onboarding experience was excellent.",
  "I had to refresh the page several times.",
  "The pricing page is confusing.",
  "Notifications arrive too late.",
  "The analytics dashboard is very helpful.",
  "The mobile layout needs improvement.",
  "I really like the clean interface.",
  "The reporting feature saves our team time.",
  "Login occasionally fails for me.",
  "The filters are easy to use.",
  "I cannot easily find older feedback.",
  "The product documentation is clear.",
  "The application feels much faster now.",
  "The CSV import took too long.",
];

const channels = ["WEB", "EMAIL", "SURVEY", "CHAT", "CSV"];

async function main() {
  console.log("Seeding LOOP database...");

  await prisma.feedbackTheme.deleteMany();
  await prisma.embedding.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.report.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  const workspace = await prisma.workspace.create({
    data: {
      name: "LOOP Demo Workspace",
      slug: "loop-demo",
    },
  });

  const password = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Demo Admin",
        email: "admin@loop.demo",
        password,
        role: "ADMIN",
        workspaceId: workspace.id,
      },
      {
        name: "Demo Analyst",
        email: "analyst@loop.demo",
        password,
        role: "ANALYST",
        workspaceId: workspace.id,
      },
      {
        name: "Demo Viewer",
        email: "viewer@loop.demo",
        password,
        role: "VIEWER",
        workspaceId: workspace.id,
      },
    ],
  });

  const themes = await Promise.all(
    [
      ["Performance", "Speed, loading and application performance"],
      ["UX & Navigation", "Usability, navigation and interface feedback"],
      ["Customer Support", "Support quality and response experience"],
      ["Mobile Experience", "Mobile layout and mobile usability"],
      ["Reporting & Analytics", "Reports, dashboards and analytics"],
    ].map(([name, description]) =>
      prisma.theme.create({
        data: {
          name,
          description,
          workspaceId: workspace.id,
        },
      })
    )
  );

  const feedbackData = Array.from({ length: 140 }, (_, i) => {
    const content = feedbackTexts[i % feedbackTexts.length];

    let sentiment: "POS" | "NEU" | "NEG" = "NEU";

    if (
      content.includes("love") ||
      content.includes("excellent") ||
      content.includes("helpful") ||
      content.includes("clear") ||
      content.includes("faster") ||
      content.includes("like")
    ) {
      sentiment = "POS";
    } else if (
      content.includes("slow") ||
      content.includes("difficult") ||
      content.includes("confusing") ||
      content.includes("late") ||
      content.includes("fails") ||
      content.includes("cannot") ||
      content.includes("does not") ||
      content.includes("improvement")
    ) {
      sentiment = "NEG";
    }

    return {
      content,
      channel: channels[i % channels.length],
      sourceRef: `DEMO-${String(i + 1).padStart(4, "0")}`,
      customerLabel: `Customer ${i + 1}`,
      sentiment,
      sentimentScore:
        sentiment === "POS"
          ? 0.7 + (i % 3) * 0.1
          : sentiment === "NEG"
            ? -(0.7 + (i % 3) * 0.1)
            : 0.1,
      status:
  i % 5 === 0
    ? ("ACTIONED" as const)
    : i % 3 === 0
      ? ("REVIEWED" as const)
      : ("NEW" as const),
      workspaceId: workspace.id,
      createdAt: new Date(Date.now() - (140 - i) * 86400000),
    };
  });

  const createdFeedback = await Promise.all(
    feedbackData.map((item) =>
      prisma.feedback.create({
        data:{
    ...item,
    status: item.status as "NEW" | "REVIEWED" | "ACTIONED",
  },
})
)
);

  for (let i = 0; i < createdFeedback.length; i++) {
    const feedback = createdFeedback[i];
    const theme = themes[i % themes.length];

    await prisma.feedbackTheme.create({
      data: {
        feedbackId: feedback.id,
        themeId: theme.id,
      },
    });
  }

  await prisma.report.create({
    data: {
      title: "Weekly Voice of Customer Report",
      content:
        "Customers are responding positively to dashboard improvements and reporting features. The main areas requiring attention are mobile usability, checkout performance, navigation and occasional login issues.",
      periodStart: new Date(Date.now() - 7 * 86400000),
      periodEnd: new Date(),
      workspaceId: workspace.id,
    },
  });

  console.log("Seed completed.");
  console.log("Workspace:", workspace.name);
  console.log("Users: 3");
  console.log("Feedback: 140");
  console.log("Themes:", themes.length);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });