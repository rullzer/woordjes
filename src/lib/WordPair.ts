// Capitals, spaces around the answer and punctuation at the end do not count
export function normalizeAnswer(answer: string): string {
	return answer
		.trim()
		.replace(/[.!?]+$/, '')
		.trim()
		.replace(/\s+/g, ' ')
		.toLowerCase();
}

export type WordPairOptions = {
	// Extra difficult word (blue in the book), not required by default
	extra?: boolean;
	// All answers that count as correct, defaults to just the translation
	acceptedTranslations?: string[];
	// Asked the other way around (e.g. Nederlands → Engels instead of Engels → Nederlands)
	reversed?: boolean;
	// A sentence instead of a word, always asked as multiple choice
	sentence?: boolean;
	// Fixed multiple choice options (grammar), instead of other words from the list
	options?: string[];
	// Shown above the question instead of the direction, e.g. the grammar topic
	label?: string;
	// Extra help shown below the question, e.g. the Dutch meaning
	hint?: string;
	// Shown after a wrong answer, e.g. the grammar rule
	explanation?: string;
};

export class WordPair {
	public readonly extra: boolean;
	public readonly acceptedTranslations: string[];
	public readonly reversed: boolean;
	public readonly sentence: boolean;
	public readonly options?: string[];
	public readonly label?: string;
	public readonly hint?: string;
	public readonly explanation?: string;

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
		this.sentence = options.sentence ?? false;
		this.options = options.options;
		this.label = options.label;
		this.hint = options.hint;
		this.explanation = options.explanation;

		if (this.options && !this.options.includes(translation)) {
			throw new Error('Options must include the translation');
		}

		if (this.acceptedTranslations.length === 0 || this.acceptedTranslations.includes('')) {
			throw new Error('Accepted translations cannot be empty');
		}
	}

	// Sentences and grammar questions are never typed
	public get alwaysMultipleChoice() {
		return this.sentence || this.options !== undefined;
	}

	public accepts(answer: string) {
		const normalized = normalizeAnswer(answer);
		return [this.translation, ...this.acceptedTranslations].some(
			(accepted) => normalizeAnswer(accepted) === normalized
		);
	}

	public equals(cmp: WordPair) {
		return this.word === cmp.word && this.translation === cmp.translation;
	}
}
