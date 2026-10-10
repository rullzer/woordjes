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

function toWordPair(entry: WordEntry, reverse: boolean): WordPair {
	const from = reverse ? entry.translation : entry.word;
	const to = reverse ? entry.word : entry.translation;
	return new WordPair(display(from), display(to), {
		extra: entry.extra ?? false,
		acceptedTranslations: alternatives(to)
	});
}

function toList(
	data: WordListData,
	entries: WordEntry[],
	name: string,
	id: string,
	reverse: boolean
): WordList {
	const labels = reverse
		? { word: data.labels.translation, translation: data.labels.word }
		: data.labels;
	const wordList = new WordList(
		reverse ? name + ' andersom' : name,
		reverse ? id + '_rev' : id,
		data.for,
		data.date,
		labels
	);
	// Extra (blue) words are not required, so they are left out for now
	wordList.addWordPairs(
		entries.filter((entry) => !entry.extra).map((entry) => toWordPair(entry, reverse))
	);
	return wordList;
}

export function toWordLists(data: WordListData): WordList[] {
	const lists = [
		toList(data, data.words, data.name, data.id, false),
		toList(data, data.words, data.name, data.id, true)
	];

	if (data.sentences && data.sentences.length > 0) {
		const name = data.name + ' zinnen';
		const id = data.id + '_zinnen';
		lists.push(
			toList(data, data.sentences, name, id, false),
			toList(data, data.sentences, name, id, true)
		);
	}

	return lists.filter((list) => list.getWordPairs().length > 0);
}

export function getWordLists(): WordList[] {
	return Object.values(files).flatMap(toWordLists);
}
