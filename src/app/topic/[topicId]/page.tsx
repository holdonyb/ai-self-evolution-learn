import { notFound } from "next/navigation";

import { TopicPage } from "@/components/topic-page";
import { getTopicById, getTopicIds } from "@/lib/knowledge";

type TopicRouteProps = {
  params: Promise<{
    topicId: string;
  }>;
};

export function generateStaticParams() {
  return getTopicIds().map((topicId) => ({ topicId }));
}

export default async function TopicRoute({ params }: TopicRouteProps) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    notFound();
  }

  return <TopicPage topic={topic} />;
}
