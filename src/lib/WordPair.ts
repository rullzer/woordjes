export type WordPairOptions = {
	// Extra difficult word (blue in the book), not required by default
	extra?: boolean;
	// All answers that count as correct, defaults to just the translation
	acceptedTranslations?: string[];
	// Asked the other way around (e.g. Nederlands → Engels instead of Engels → Nederlands)
	reversed?: boolean;
};

export class WordPair {
	public readonly extra: boolean;
	public readonly acceptedTranslations: string[];
	public readonly reversed: boolean;

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
		this.reversed = options.reversed ?? false;

		if (this.acceptedTranslations.length === 0 || this.acceptedTranslations.includes('')) {
			throw new Error('Accepted translations cannot be empty');
		}
	}

	public equals(cmp: WordPair) {
		return this.word === cmp.word && this.translation === cmp.translation;
	}
}
