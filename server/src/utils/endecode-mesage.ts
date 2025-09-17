export function encodeMessage(content: string): string {
  return Buffer.from(content, "utf-8").toString("base64");
}

export function decodeMessage(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf-8");
}
