import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LearningHome } from "@/components/learning-home";

describe("LearningHome", () => {
  it("renders the knowledge map and the agent entry", () => {
    render(<LearningHome />);

    expect(screen.getByText("AI 自进化学习站")).toBeInTheDocument();
    expect(screen.getByText("首页负责导航和定位，真正的深读发生在每个 topic 页")).toBeInTheDocument();
    expect(screen.getAllByText("概念与思想起源").length).toBeGreaterThan(0);
    expect(screen.getAllByText("另一种声音：冷静与质疑").length).toBeGreaterThan(0);
    expect(screen.getByText("站内 AI 助教")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "例如：AlphaZero、AlphaEvolve、Nested Learning 三者是什么关系？它们分别代表哪一层自进化能力？",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /进入主题/ }).length).toBeGreaterThan(0);
  });
});
