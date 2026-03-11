import { WordPair } from './WordPair';

export type WordListLabels = {
	word: string;
	translation: string;
};

export class WordList {
	private wordPairs: WordPair[] = [];

	constructor(
		public readonly name: string,
		public readonly id: string,
		public readonly for_: string,
		public readonly date: string,
		public readonly labels: WordListLabels
	) {}

	public getWordPairs() {
		return this.wordPairs;
	}

	public addWordPair(wordPair: WordPair) {
		if (
			this.wordPairs.some((pair) => {
				return pair.equals(wordPair);
			})
		) {
			// Do not add duplicates
			return;
		}

		this.wordPairs.push(wordPair);
	}

	public addWordPairs(wordPairs: WordPair[]) {
		for (const wordPair of wordPairs) {
			this.addWordPair(wordPair);
		}
	}
}
