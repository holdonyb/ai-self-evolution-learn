import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TopicPage } from "@/components/topic-page";
import { getModuleById } from "@/lib/knowledge";

describe("TopicPage", () => {
  it("renders a dedicated learning page for one topic", () => {
    const topicModule = getModuleById("origins");
    if (!topicModule) {
      throw new Error("expected origins module");
    }

    render(<TopicPage module={topicModule} />);

    expect(screen.getByText("概念与思想起源")).toBeInTheDocument();
    expect(screen.getByText("所谓“AI 自进化”到底是什么，它为什么会让人既兴奋又紧张？")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回首页" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /进入下一个主题/ })).toHaveAttribute(
      "href",
      "/topic/self-play",
    );
  });
});
