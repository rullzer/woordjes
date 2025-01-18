import { WordPair } from "./WordPair";

export class WordList {
	private wordPairs: WordPair[] = [];

	constructor(public readonly name: string) {

	}

	public getWordPairs() {
		return this.wordPairs;
	}

	public addWordPair(wordPair: WordPair) {
		if (this.wordPairs.some((pair) => {
			return pair.equals(wordPair);
		})) {
			// Do not add duplicates
			return;
		}
		
		this.wordPairs.push(wordPair);
	}
}