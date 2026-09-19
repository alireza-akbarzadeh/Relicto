export type PasswordRule = { id: string; label: string; passed: boolean };

export type PasswordStrength = { score: number; label: "Weak" | "Fair" | "Good" | "Strong"; rules: PasswordRule[] };

/** Rule-based strength for the sign-up "entropy matrix" (0–100). */
export function passwordStrength(password: string): PasswordStrength {
  const rules: PasswordRule[] = [
    { id: "length", label: "Length ≥ 12", passed: password.length >= 12 },
    { id: "symbols", label: "Symbols (!@#$)", passed: /[^A-Za-z0-9]/.test(password) },
    { id: "numbers", label: "Numerics", passed: /\d/.test(password) },
    { id: "case", label: "Upper & Lowercase", passed: /[a-z]/.test(password) && /[A-Z]/.test(password) },
  ];
  const passed = rules.filter((r) => r.passed).length;
  const lengthBonus = Math.min(password.length, 14) / 14;
  const score = Math.round(passed * 20 + lengthBonus * 14);
  const label = score >= 85 ? "Strong" : score >= 60 ? "Good" : score >= 35 ? "Fair" : "Weak";
  return { score, label, rules };
}
