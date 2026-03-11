import { WordList } from './WordList';
import { WordPair } from './WordPair';

const files = import.meta.glob('./data/*.json', { eager: true, import: 'default' }) as Record<
	string,
	{
		id: string;
		name: string;
		for: string;
		date: string;
		labels: { word: string; translation: string };
		words: { word: string; translation: string }[];
	}
>;

type WordListData = (typeof files)[string];

function toWordList(data: WordListData): WordList {
	const wordList = new WordList(data.name, data.id, data.for, data.date, data.labels);
	wordList.addWordPairs(data.words.map((w) => new WordPair(w.word, w.translation)));
	return wordList;
}

function toReverseWordList(data: WordListData): WordList {
	const reverseLabels = { word: data.labels.translation, translation: data.labels.word };
	const reverseWordList = new WordList(
		data.name + ' andersom',
		data.id + '_rev',
		data.for,
		data.date,
		reverseLabels
	);
	reverseWordList.addWordPairs(data.words.map((w) => new WordPair(w.translation, w.word)));
	return reverseWordList;
}

export function getWordLists(): WordList[] {
	return Object.values(files).flatMap((data) => [toWordList(data), toReverseWordList(data)]);
}
