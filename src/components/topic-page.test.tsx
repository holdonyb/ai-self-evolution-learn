import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TopicPage } from "@/components/topic-page";
import { getTopicById } from "@/lib/knowledge";

describe("TopicPage", () => {
  it("renders a dedicated learning page for one theme", () => {
    const topic = getTopicById("ai-self-evolution");
    if (!topic) {
      throw new Error("expected ai-self-evolution topic");
    }

    render(<TopicPage topic={topic} />);

    expect(screen.getByText("AI 自进化")).toBeInTheDocument();
    expect(
      screen.getByText("如果 AI 不只是辅助人类，而是逐步参与“改进 AI 本身”，这条能力链条现在到底走到了哪一层？"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回首页" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /返回主题目录/ })).toHaveAttribute("href", "/");
    expect(screen.getByRole("heading", { name: "六步读懂 AI 自进化" })).toBeInTheDocument();
    expect(screen.getByLabelText("AI 自进化主题路径")).toBeInTheDocument();
    expect(screen.getByText("从封闭规则走到开放系统")).toBeInTheDocument();
    expect(screen.getAllByText("读这一节")).toHaveLength(topic.modules.length);
    expect(screen.getByAltText("自我对弈与算法发现")).toBeInTheDocument();
    expect(screen.getByAltText("持续学习与产业验证")).toBeInTheDocument();
  });
});
