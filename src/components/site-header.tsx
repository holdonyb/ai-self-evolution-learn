import Link from "next/link";
import { BookMarked, Bot, GitCompareArrows, Layers3, Search } from "lucide-react";

type SiteHeaderProps = {
  active?: "home" | "topics" | "compare" | "assistant";
};

const navItems = [
  { href: "/", label: "首页", key: "home" as const },
  { href: "/#topics", label: "学习主题", key: "topics" as const },
  { href: "/#framework", label: "对比框架", key: "compare" as const },
  { href: "/#assistant", label: "学习助手", key: "assistant" as const },
];

export function SiteHeader({ active = "home" }: SiteHeaderProps) {
  return (
    <header className="site-header-shell">
      <div className="site-header">
        <Link className="site-brand" href="/">
          <span>Learn</span>
          <strong>结构化学习</strong>
        </Link>

        <nav className="site-nav" aria-label="主导航">
          {navItems.map((item) => (
            <Link
              key={item.label}
              className={item.key === active ? "site-nav-link is-active" : "site-nav-link"}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-tools" aria-label="站点工具">
          <span>
            <Search size={16} />
            结构化检索
          </span>
          <span>
            <Layers3 size={16} />
            主题图谱
          </span>
          <span>
            <GitCompareArrows size={16} />
            横向比较
          </span>
          <span>
            <Bot size={16} />
            AI 助教
          </span>
          <span>
            <BookMarked size={16} />
            深读路径
          </span>
        </div>
      </div>
    </header>
  );
}
