import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LearningHome } from "@/components/learning-home";

describe("LearningHome", () => {
  it("renders the topic directory and the study assistant entry", () => {
    render(<LearningHome />);

    expect(screen.getAllByText("Learn").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "选择主题 开始学习" })).toBeInTheDocument();
    expect(screen.getAllByText("AI 自进化").length).toBeGreaterThan(0);
    expect(screen.getByText("站内 AI 助教")).toBeInTheDocument();
    expect(screen.queryByText("主题站壳层")).not.toBeInTheDocument();
    expect(screen.queryByText("概念与思想起源")).not.toBeInTheDocument();
    expect(screen.queryByText("自我对弈：AI 第一次自己变强")).not.toBeInTheDocument();
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
