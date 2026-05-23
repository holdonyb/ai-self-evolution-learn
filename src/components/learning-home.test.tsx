import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LearningHome } from "@/components/learning-home";

describe("LearningHome", () => {
  it("renders the knowledge map and the agent entry", () => {
    render(<LearningHome />);

    expect(screen.getByText("AI 自进化学习站")).toBeInTheDocument();
    expect(screen.getByText("六个模块看懂 AI 如何一步步学会改进自己")).toBeInTheDocument();
    expect(screen.getAllByText("概念与思想起源").length).toBeGreaterThan(0);
    expect(screen.getAllByText("另一种声音：冷静与质疑").length).toBeGreaterThan(0);
    expect(screen.getByText("站内 AI 助教")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例如：AlphaZero、AlphaEvolve、Nested Learning 三者是什么关系？")).toBeInTheDocument();
  });
});
