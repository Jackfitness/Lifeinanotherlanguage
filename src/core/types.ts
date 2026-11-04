/**
 * Shared types. Language codes are plain strings so a new language can be
 * added by registering it in content/languages.ts and adding text to content
 * entries, without touching the type system.
 */
export type LangCode = string;
/** Text keyed by language code. Japanese strings use the ruby markup described in learning/text.ts. */
export type LText = Record<LangCode, string>;
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type JaScript = 'kana' | 'furigana' | 'kanji';
export type Expr = 'neutral' | 'happy' | 'surprised' | 'sad' | 'thinking' | 'love' | 'sleepy';
export type Species = 'bear' | 'bunny' | 'capybara' | 'cat' | 'fox' | 'dog' | 'duck' | 'frog' | 'penguin' | 'otter' | 'raccoon' | 'owl' | 'deer' | 'panda' | 'hedgehog';

export const LEVEL_NUM: Record<Level, number> = { beginner: 1, intermediate: 2, advanced: 3 };
