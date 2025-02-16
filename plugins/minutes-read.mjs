import getReadingTime from "reading-time";
import { toString as toText } from "mdast-util-to-string";

export function remarkReadingTime() {
  return (tree, { data }) => {
    const textOnPage = toText(tree);
    const readingTime = getReadingTime(textOnPage);

    data.astro.frontmatter.minutesRead = Math.round(readingTime.minutes);
  };
}
