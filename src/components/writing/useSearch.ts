import Fuse from "fuse.js";
import { useCallback, useEffect, useRef } from "react";

const KEYS = ["title", "description"];

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
    (query: string) => {
      if (query.length === 0) {
        return posts ?? [];
      }

      return fuse.current
        .search({
          $or: [{ title: `'${query}` }, { description: `'${query}` }],
        })
        .map((record) => record.item);
    },
    [posts],
  );

  return {
    search,
  };
};
