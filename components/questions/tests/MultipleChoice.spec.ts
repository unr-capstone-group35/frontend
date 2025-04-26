// run pnpm test or
// pnpm test:watch

import { mount } from "@vue/test-utils";
import MultipleChoice from "@/components/questions/MultipleChoice.vue";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("MultipleChoice Component", () => {
  const sampleExercise = {
    question: "What is JavaScript?",
    choices: ["A programming language", "A markup language", "A styling language", "An operating system"],
    correctAnswer: 0,
  };

  // Spy on console.log to verify it's called with expected arguments
  beforeEach(() => {
    vi.spyOn(console, "log");
  });

  // Test rendering the question
  it("renders the exercise question", () => {
    const wrapper = mount(MultipleChoice, {
      props: {
        exercise: sampleExercise,
        selectedAnswer: null as unknown as number,
      },
    });

    expect(wrapper.text()).toContain("What is JavaScript?");
  });

  // Test that all choices are rendered
  it("renders all choices", () => {
    const wrapper = mount(MultipleChoice, {
      props: {
        exercise: sampleExercise,
        selectedAnswer: null as unknown as number,
      },
    });

    //check text content rather than order since choices are randomized
    sampleExercise.choices.forEach((choice) => {
      expect(wrapper.text()).toContain(choice);
    });

    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(sampleExercise.choices.length);
  });

  it("emits update-answer event when a choice is selected", async () => {
    const wrapper = mount(MultipleChoice, {
      props: {
        exercise: sampleExercise,
        selectedAnswer: null as unknown as number,
      },
    });

    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBeGreaterThan(0);

    await buttons[0].trigger("click");

    const emitted = wrapper.emitted("update-answer");
    expect(emitted).toBeTruthy();

    if (emitted) {
      expect(emitted.length).toBeGreaterThan(0);
      expect(emitted[0]).toBeTruthy();
    }

    expect(console.log).toHaveBeenCalled();
  });

  it("applies selected styling to the chosen answer", async () => {
    const wrapper = mount(MultipleChoice, {
      props: {
        exercise: sampleExercise,
        selectedAnswer: 0,
      },
    });

    const buttons = wrapper.findAll("button");

    // At least one button should have the selected class
    const hasSelectedButton = buttons.some((button) =>
      button
        .classes()
        .some(
          (cls) => cls.includes("bg-blue-100") || cls.includes("dark:bg-blue-900") || cls.includes("border-blue-500"),
        ),
    );

    expect(hasSelectedButton).toBe(true);
  });
});
