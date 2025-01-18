import { WordList } from "./WordList";
import { WordPair } from "./WordPair";

const shuffle = <T>(array: T[]) => {
	return array.sort(() => Math.random() - 0.5);
}

type score = {
	correct: number;
	incorrect: number;
	total: number;
}

export class GameSession {
	private words: WordPair[];
	private currentWord: WordPair | null = null;

	private correct: number = 0;
	private incorrect: number = 0;
	private total: number;

	constructor(private readonly wordList: WordList) {
		this.words = shuffle(wordList.getWordPairs());		
		this.total = this.words.length;
	}

	public getWords() {
		return this.words;
	}

	public getNextWord() {
		this.currentWord = this.words.shift() ?? null;
		return this.currentWord;
	}

	public getMultipleChoiceOptions() {
		if (this.currentWord === null) {
			return [];
		}

		const currentExisting = this.currentWord;

		const results = [currentExisting.translation];

		const remaining = this.wordList.getWordPairs().filter((pair) => !pair.equals(currentExisting));
		const randomized = shuffle(remaining);

		const randomOptions = randomized.slice(0,4).map((pair) => pair.translation);
		return results.concat(randomOptions);
	}

	public answerCurrentWord(answer: string) {
		if (this.currentWord?.translation === answer) {
			this.correct++;
			return true;
		} else {
			this.incorrect++;
			return false;
		}
	}

	public getScore() {
		return {
			correct: this.correct,
			incorrect: this.incorrect,
			total: this.total,
		};
	}
}