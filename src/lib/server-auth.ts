import { headers } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function requireServerUser() {
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization") ?? "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: missing bearer token");
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    throw new Error("Unauthorized: empty token");
  }

  const decoded = await getAdminAuth().verifyIdToken(token);
  return decoded;
}
