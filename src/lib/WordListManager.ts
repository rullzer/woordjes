import { WordList } from './WordList';
import { WordPair } from './WordPair';

// A word or translation is either a single text or a list of alternatives
// that are all correct, e.g. ["slordig", "rommelig"].
type Text = string | string[];

type WordEntry = {
	word: Text;
	translation: Text;
	extra?: boolean;
};

export type WordListData = {
	id: string;
	name: string;
	for: string;
	date: string;
	labels: { word: string; translation: string };
	words: WordEntry[];
	sentences?: WordEntry[];
};

export type Direction = 'forward' | 'reverse' | 'mixed';
// Sentences are always multiple choice, the mode only applies to words
export type Mode = 'choice' | 'typing';

export type PracticeSettings = {
	direction: Direction;
	mode: Mode;
	includeExtra: boolean;
};

export const defaultSettings: PracticeSettings = {
	direction: 'forward',
	mode: 'choice',
	includeExtra: false
};

const directions: Direction[] = ['forward', 'reverse', 'mixed'];
const modes: Mode[] = ['choice', 'typing'];

// Turn (possibly outdated or broken) stored settings into valid settings
export function parseSettings(stored: unknown): PracticeSettings {
	const value = (typeof stored === 'object' && stored !== null ? stored : {}) as Record<
		string,
		unknown
	>;
	return {
		direction: directions.includes(value.direction as Direction)
			? (value.direction as Direction)
			: defaultSettings.direction,
		mode: modes.includes(value.mode as Mode) ? (value.mode as Mode) : defaultSettings.mode,
		includeExtra:
			typeof value.includeExtra === 'boolean' ? value.includeExtra : defaultSettings.includeExtra
	};
}

const files = import.meta.glob('./data/*.json', { eager: true, import: 'default' }) as Record<
	string,
	WordListData
>;

function alternatives(text: Text): string[] {
	return Array.isArray(text) ? text : [text];
}

function display(text: Text): string {
	return alternatives(text).join(', ');
}

function toWordPair(entry: WordEntry, reversed: boolean, sentence: boolean): WordPair {
	const from = reversed ? entry.translation : entry.word;
	const to = reversed ? entry.word : entry.translation;
	return new WordPair(display(from), display(to), {
		extra: entry.extra ?? false,
		acceptedTranslations: alternatives(to),
		reversed,
		sentence
	});
}

export function countEntries(data: WordListData) {
	const sentences = data.sentences ?? [];
	return {
		words: data.words.filter((entry) => !entry.extra).length,
		extraWords: data.words.filter((entry) => entry.extra).length,
		sentences: sentences.filter((entry) => !entry.extra).length,
		extraSentences: sentences.filter((entry) => entry.extra).length
	};
}

export function toWordList(
	data: WordListData,
	settings: PracticeSettings,
	random: () => number = Math.random
): WordList {
	const wordList = new WordList(data.name, data.id, data.for, data.date, data.labels);

	const toPairs = (entries: WordEntry[], sentence: boolean) =>
		entries
			.filter((entry) => settings.includeExtra || !entry.extra)
			.map((entry) => {
				const reversed =
					settings.direction === 'mixed' ? random() < 0.5 : settings.direction === 'reverse';
				return toWordPair(entry, reversed, sentence);
			});

	wordList.addWordPairs(toPairs(data.words, false));
	wordList.addWordPairs(toPairs(data.sentences ?? [], true));
	return wordList;
}

export function getWordListData(): WordListData[] {
	return Object.values(files).sort((a, b) => b.date.localeCompare(a.date));
}

export function findWordListData(id: string): WordListData | undefined {
	return getWordListData().find((data) => data.id === id);
}
