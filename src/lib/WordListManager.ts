import { WordList } from './WordList';
import { WordPair } from './WordPair';

const files = import.meta.glob('./data/*.json', { eager: true, import: 'default' }) as Record<
	string,
	{ name: string; id: string; words: { word: string; translation: string }[] }
>;

type WordListData = { name: string; id: string; words: { word: string; translation: string }[] };

function toWordList(data: WordListData): WordList {
	const wordList = new WordList(data.name, data.id);
	wordList.addWordPairs(data.words.map((w) => new WordPair(w.word, w.translation)));
	return wordList;
}

function toReverseWordList(data: WordListData): WordList {
	const reverseWordList = new WordList(data.name + ' andersom', data.id + '_rev');
	reverseWordList.addWordPairs(data.words.map((w) => new WordPair(w.translation, w.word)));
	return reverseWordList;
}

export function getWordLists(): WordList[] {
	return Object.values(files).flatMap((data) => [toWordList(data), toReverseWordList(data)]);
}
