import jenna1 from './data/jenna-woordjes-engels-202511.json'
import teske1 from './data/teske-woordjes-20251118.json'
import teske2 from './data/teske-woordjes-engels-20251203.json'
import { WordList } from './WordList';
import { WordPair } from './WordPair';

function parseImport(data: { name: string, id: string, words: { word: string, translation: string}[]}) {
	const wordPairs = data.words.map((word) => {
		return new WordPair(word.word, word.translation);
	});

	const wordList = new WordList(data.name, data.id);
	wordList.addWordPairs(wordPairs);

	return [wordList];
}

export function getWordLists(): WordList[] {
	return [
		parseImport(jenna1),
		parseImport(teske1),
		parseImport(teske2),
	].flat();
}