import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
/** Returns the signed-in user's DB id, or null. */
export async function requireUserId(): Promise<string | null> {
  const s = await getServerSession(authOptions);
  return ((s?.user as { id?: string } | undefined)?.id) ?? null;
}
