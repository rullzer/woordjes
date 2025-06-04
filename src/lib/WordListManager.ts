import jenna1 from './data/jenna-woordjes-engels-20250520.json'
import teske1 from './data/teske-woordjes-engels-20250507.json'
import teske2 from './data/teske-woordjes-engels.json'
import teske3 from './data/teske-woordjes-engels-26032025.json'
import teske4 from './data/teske-woordjes-20250528.json'
import teske5 from './data/teske-woordjes-20250621.json'
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
		parseImport(teske2),
		parseImport(teske3),
		parseImport(teske4),
		parseImport(teske5),
	];
}