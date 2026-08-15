import type { UiKey } from "./ui";

// A serialized snapshot of one language's strings, handed to client islands as
// a prop so they can translate themselves instead of receiving each label
// individually.
export type Messages = Record<UiKey, string>;

export type Translator = (key: UiKey) => string;

export const createTranslator =
  (messages: Messages): Translator =>
  (key) =>
    messages[key] ?? key;
