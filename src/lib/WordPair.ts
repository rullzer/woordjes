export type WordPairOptions = {
	// Extra difficult word (blue in the book), not required by default
	extra?: boolean;
	// All answers that count as correct, defaults to just the translation
	acceptedTranslations?: string[];
};

export class WordPair {
	public readonly extra: boolean;
	public readonly acceptedTranslations: string[];

	constructor(
		public readonly word: string,
		public readonly translation: string,
		options: WordPairOptions = {}
	) {
		if (word === '' || translation === '') {
			throw new Error('Word and translation cannot be empty');
		}

		this.extra = options.extra ?? false;
		this.acceptedTranslations = options.acceptedTranslations ?? [translation];

		if (this.acceptedTranslations.length === 0 || this.acceptedTranslations.includes('')) {
			throw new Error('Accepted translations cannot be empty');
		}
	}

	public equals(cmp: WordPair) {
		return this.word === cmp.word && this.translation === cmp.translation;
	}
}
