export const getSortedByDate = <T extends { date: Date }>(
  posts: T[],
  compareFn: (a: T, b: T) => number = (a: T, b: T) => {
    return b.date.getTime() - a.date.getTime();
  },
) => posts.toSorted(compareFn);
