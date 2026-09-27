import type { SessionUser } from "./auth";

export function canViewDashboard(user: SessionUser) {
  return ["ADMIN", "ANALYST", "VIEWER"].includes(user.role);
}

export function canManageFeedback(user: SessionUser) {
  return ["ADMIN", "ANALYST"].includes(user.role);
}

export function canGenerateReports(user: SessionUser) {
  return ["ADMIN", "ANALYST"].includes(user.role);
}

export function canManageSettings(user: SessionUser) {
  return user.role === "ADMIN";
}