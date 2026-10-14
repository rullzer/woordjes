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
export type Part = 'words' | 'sentences';

export type PracticeSettings = {
	direction: Direction;
	part: Part;
	includeExtra: boolean;
};

export const defaultSettings: PracticeSettings = {
	direction: 'forward',
	part: 'words',
	includeExtra: false
};

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

function toWordPair(entry: WordEntry, reversed: boolean): WordPair {
	const from = reversed ? entry.translation : entry.word;
	const to = reversed ? entry.word : entry.translation;
	return new WordPair(display(from), display(to), {
		extra: entry.extra ?? false,
		acceptedTranslations: alternatives(to),
		reversed
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
	const isSentences = settings.part === 'sentences';
	const wordList = new WordList(
		isSentences ? data.name + ' zinnen' : data.name,
		data.id,
		data.for,
		data.date,
		data.labels
	);

	const entries = (isSentences ? (data.sentences ?? []) : data.words).filter(
		(entry) => settings.includeExtra || !entry.extra
	);
	wordList.addWordPairs(
		entries.map((entry) => {
			const reversed =
				settings.direction === 'mixed' ? random() < 0.5 : settings.direction === 'reverse';
			return toWordPair(entry, reversed);
		})
	);
	return wordList;
}

export function getWordListData(): WordListData[] {
	return Object.values(files).sort((a, b) => b.date.localeCompare(a.date));
}

export function findWordListData(id: string): WordListData | undefined {
	return getWordListData().find((data) => data.id === id);
}
