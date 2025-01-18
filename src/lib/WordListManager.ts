import colors from './data/colors.json';
import animals from './data/animals.json';
import { WordList } from './WordList';
import { WordPair } from './WordPair';

function parseImport(data: { name: string, words: { word: string, translation: string}[]}) {
	const wordPairs = data.words.map((word) => {
		return new WordPair(word.word, word.translation);
	});

	const wordList = new WordList(data.name);
	wordPairs.forEach((wordPair) => {
		wordList.addWordPair(wordPair);
	});

	return wordList;
}

export function getWordLists(): WordList[] {
	return [
		parseImport(colors),
		parseImport(animals)
	];
}