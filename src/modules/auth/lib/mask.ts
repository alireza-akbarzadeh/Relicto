/** "trader@example.com" → "t****r@example.com"; other identifiers keep their ends. */
export function maskIdentifier(value: string) {
  const input = value.trim() || "trader@example.com";
  if (input.includes("@")) {
    const [name, domain] = input.split("@");
    const masked = name.length > 2 ? `${name[0]}****${name.slice(-1)}` : `${name}****`;
    return `${masked}@${domain}`;
  }
  return `${input.slice(0, 3)}****${input.slice(-3)}`;
}
