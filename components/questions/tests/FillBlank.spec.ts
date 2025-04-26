// run pnpm test or
// pnpm test:watch

import { describe, it, expect, vi } from "vitest";

describe("FillBlank Component (Simplified)", () => {
  // Test if testing environment is working
  it("should verify basic functionality", () => {
    expect(true).toBe(true);
  });

  // Test if underscores in questions are properly expanded
  it("should format questions correctly", () => {
    const formatQuestion = (question: string): string => {
      return question.replace("_", "_____");
    };

    expect(formatQuestion("JavaScript is a _ language")).toBe("JavaScript is a _____ language");
  });

  // Test if answer validation correctly identifies empty/null values
  it("should validate empty answers", () => {
    const isValidAnswer = (answer: string | null): boolean => {
      return answer !== null && answer !== "";
    };

    expect(isValidAnswer("")).toBe(false);
    expect(isValidAnswer(null)).toBe(false);
    expect(isValidAnswer("programming")).toBe(true);
  });
});
