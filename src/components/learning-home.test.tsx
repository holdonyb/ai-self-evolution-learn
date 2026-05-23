import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LearningHome } from "@/components/learning-home";

describe("LearningHome", () => {
  it("renders the topic directory and the study assistant entry", () => {
    render(<LearningHome />);

    expect(screen.getByText("结构化自主学习主题站")).toBeInTheDocument();
    expect(screen.getByText("首页负责导航，真正的深读发生在每个主题的下级页面")).toBeInTheDocument();
    expect(screen.getAllByText("AI 自进化").length).toBeGreaterThan(0);
    expect(screen.getByText("站内 AI 助教")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "例如：AlphaZero、AlphaEvolve、Nested Learning 三者是什么关系？它们分别代表哪一层自进化能力？",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /进入这个主题/ })).toHaveAttribute(
      "href",
      "/topic/ai-self-evolution",
    );
  });
});
