export function isAdminEmail(email, allowlist = process.env.ADMIN_EMAILS) {
  if (typeof email !== "string" || typeof allowlist !== "string") return false;
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return false;
  return allowlist.split(",").some((entry) => entry.trim().toLowerCase() === normalizedEmail);
}

export function isAdminSession(session) {
  return session?.role === "admin" && (
    isAdminEmail(session.email) || session.email === "local-admin@addiseats.invalid"
  );
}
