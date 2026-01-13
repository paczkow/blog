import type { Essay } from "@/models.ts";
import { Card } from "../Card";

export const SearchList = ({ posts }: { posts: Essay[] }) => {
  return (
    <div className="group flex flex-col gap-8">
      {!posts.length && (
        <h2 className="text-sand-12">No results found</h2>
      )}
      {posts.map((post) => (
        <Card
          id={post.id}
          key={post.id}
          title={post.title}
          description={post.description}
          date={post.date}
          readTime={post.readTime}
        />
      ))}
    </div>
  );
};
