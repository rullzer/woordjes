import teske1 from './data/teske-woordjes-202512.json'
import { WordList } from './WordList';
import { WordPair } from './WordPair';

function parseImport(data: { name: string, id: string, words: { word: string, translation: string}[]}) {
	const wordPairs = data.words.map((word) => {
		return new WordPair(word.word, word.translation);
	});

	const wordList = new WordList(data.name, data.id);
	wordList.addWordPairs(wordPairs);

	const reverseWordList = new WordList(data.name + ' andersom', data.id+'_rev');
	const reverseWordPairs = data.words.map((word) => {
		return new WordPair(word.translation, word.word);
	});
	reverseWordList.addWordPairs(reverseWordPairs);

	return [wordList, reverseWordList];
}

export function getWordLists(): WordList[] {
	return [
		parseImport(teske1),
	].flat();
}