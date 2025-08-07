import Fuse from "fuse.js";
import { useCallback, useEffect, useRef } from "react";

const KEYS = ["title", "description", "topics", "type"];

export const useSearch = <T>(posts: T[]) => {
  const fuse = useRef(
    new Fuse(posts, {
      keys: KEYS,
      useExtendedSearch: true,
    }),
  );

  useEffect(() => {
    fuse.current.setCollection(posts);
  }, [posts]);

  const search = useCallback(
    (query: string, topics: string[], types: ("essay" | "note")[]) => {
      if (query.length === 0 && topics.length === 0 && types.length === 0) {
        return posts ?? [];
      }

      const searchConditions = [];

      if (query.length > 0) {
        searchConditions.push({
          $or: [{ title: `'${query}` }, { description: `'${query}` }],
        });
      }

      if (topics.length > 0) {
        const topicsQuery = topics.map((topic) => `'${topic}`).join(" | ");
        searchConditions.push({ topics: topicsQuery });
      }

      if (types.length > 0) {
        searchConditions.push({
          $or: types.map((type) => ({ type: `'${type}` })),
        });
      }

      return fuse.current
        .search({ $and: searchConditions })
        .map((record) => record.item);
    },
    [posts],
  );

  return {
    search,
  };
};
