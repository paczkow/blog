import type { Essay, Note } from "@/models.ts";
import { Card } from "../Card";

type Post = Essay & { readTime: number } | Note;

export const SearchList = ({ posts }: { posts: Post[] }) => {
  return (
    <div className="group flex flex-col gap-16 md:gap-8">
      {!posts.length && (
        <h2 className="text-sand-12">No results found</h2>
      )}
      {posts.map((post) => {
        if (post.type === "essay") {
          return (
            <Card
              id={post.id}
              key={post.id}
              variant="essay"
              title={post.title}
              description={post.description}
              date={post.date}
              readTime={post.readTime}
              topics={post.topics}
            />
          );
        }

        return (
          <Card
            id={post.id}
            key={post.id}
            variant="note"
            title={post.title}
            date={post.date}
            topics={post.topics}
            status={post.status}
          />
        );
      })}
    </div>
  );
};
