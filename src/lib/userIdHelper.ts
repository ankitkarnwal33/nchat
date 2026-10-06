export function extractUserId(raw: string): string {
  const match = raw.match(/"user_id"\s*:\s*"?(\d+)"?/);
  if (!match) throw new Error("Could not read Instagram user_id");
  return match[1]; // exact string, never rounded
}
