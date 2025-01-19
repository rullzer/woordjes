import { WordList } from "./WordList";
import { WordPair } from "./WordPair";

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]; // Create a copy of the array to avoid mutating the original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index between 0 and i
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
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

	private i = 0;

	constructor(private readonly wordList: WordList) {
		this.words = shuffleArray(wordList.getWordPairs());		
		this.total = this.words.length;
	}

	public getWords() {
		return this.words;
	}

	public getNextWord() {
		if (this.i >= this.words.length) {
			return null;
		}
		this.currentWord = this.words[this.i];
		this.i++;
		return this.currentWord;
	}

	public getMultipleChoiceOptions() {
		if (this.currentWord === null) {
			return [];
		}

		const currentExisting = this.currentWord;

		const results = [currentExisting.translation];

		const remaining = this.wordList.getWordPairs().filter((pair) => !pair.equals(currentExisting));
		const randomized = shuffleArray(remaining);

		const randomOptions = randomized.slice(0,4).map((pair) => pair.translation);
		return shuffleArray(results.concat(randomOptions));
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