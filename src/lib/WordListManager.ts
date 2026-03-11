import { WordList } from './WordList';
import { WordPair } from './WordPair';

const files = import.meta.glob('./data/*.json', { eager: true, import: 'default' }) as Record<
	string,
	{ name: string; id: string; words: { word: string; translation: string }[] }
>;

function parseImport(data: { name: string; id: string; words: { word: string; translation: string }[] }) {
	const wordList = new WordList(data.name, data.id);
	wordList.addWordPairs(data.words.map((w) => new WordPair(w.word, w.translation)));

	const reverseWordList = new WordList(data.name + ' andersom', data.id + '_rev');
	reverseWordList.addWordPairs(data.words.map((w) => new WordPair(w.translation, w.word)));

	return [wordList, reverseWordList];
}

export function getWordLists(): WordList[] {
	return Object.values(files).flatMap(parseImport);
}
