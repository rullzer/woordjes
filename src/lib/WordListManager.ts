import jenna1 from './data/jenna-woordjes-engels-20250401.json'
import teske1 from './data/teske-woordjes-20250410.json'
import { WordList } from './WordList';
import { WordPair } from './WordPair';

function parseImport(data: { name: string, id: string, words: { word: string, translation: string}[]}) {
	const wordPairs = data.words.map((word) => {
		return new WordPair(word.word, word.translation);
	});

	const wordList = new WordList(data.name, data.id);
	wordPairs.forEach((wordPair) => {
		wordList.addWordPair(wordPair);
	});

	return wordList;
}

export function getWordLists(): WordList[] {
	return [
		parseImport(jenna1),
		parseImport(teske1),
	];
}