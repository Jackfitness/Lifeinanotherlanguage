import type { LangCode } from '../core/types';

export interface LanguageInfo {
  code: LangCode;
  /** The language's name written in itself. */
  autonym: string;
  /** BCP-47 locales for speech synthesis, in order of preference. */
  tts: string[];
  /** Whether this language uses the Japanese ruby markup and script options. */
  japaneseScripts?: boolean;
  flag: string;
}

/** Register new languages here. Content entries simply add a key for the new code. */
export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', autonym: 'English', tts: ['en-US', 'en-GB', 'en'], flag: '🌻' },
  { code: 'es', autonym: 'Español', tts: ['es-MX', 'es-US', 'es-419', 'es-ES', 'es'], flag: '🌺' },
  { code: 'ja', autonym: '日本語', tts: ['ja-JP', 'ja'], japaneseScripts: true, flag: '🌸' },
];

/** This is a Japanese-learning game: everyone studies Japanese, with English or Spanish as their own language. */
export const TARGET_LANG = 'ja';
export const NATIVE_LANGS: LangCode[] = ['en', 'es'];

export const langInfo = (code: LangCode) => LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
