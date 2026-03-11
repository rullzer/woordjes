import { describe, it, expect } from 'vitest';
import { GameSession } from './GameSession';
import { WordList } from './WordList';
import { WordPair } from './WordPair';

function makeWordList(pairs: [string, string][]): WordList {
	const list = new WordList('Test', 'test');
	list.addWordPairs(pairs.map(([word, translation]) => new WordPair(word, translation)));
	return list;
}

describe('GameSession', () => {
	describe('getNextWord', () => {
		it('returns each word exactly once', () => {
			const list = makeWordList([
				['hond', 'dog'],
				['kat', 'cat'],
				['vis', 'fish'],
			]);
			const session = new GameSession(list);
			const seen: string[] = [];
			let word = session.getNextWord();
			while (word !== null) {
				seen.push(word.word);
				word = session.getNextWord();
			}
			expect(seen).toHaveLength(3);
			expect(seen).toContain('hond');
			expect(seen).toContain('kat');
			expect(seen).toContain('vis');
		});

		it('returns null when all words are exhausted', () => {
			const list = makeWordList([['hond', 'dog']]);
			const session = new GameSession(list);
			session.getNextWord();
			expect(session.getNextWord()).toBeNull();
		});
	});

	describe('getMultipleChoiceOptions', () => {
		it('returns empty array before getNextWord is called', () => {
			const list = makeWordList([['hond', 'dog']]);
			const session = new GameSession(list);
			expect(session.getMultipleChoiceOptions()).toEqual([]);
		});

		it('always includes the correct translation', () => {
			const list = makeWordList([
				['hond', 'dog'],
				['kat', 'cat'],
				['vis', 'fish'],
				['vogel', 'bird'],
				['paard', 'horse'],
			]);
			const session = new GameSession(list);
			const word = session.getNextWord()!;
			const options = session.getMultipleChoiceOptions();
			expect(options).toContain(word.translation);
		});

		it('returns at most 5 options', () => {
			const list = makeWordList([
				['hond', 'dog'],
				['kat', 'cat'],
				['vis', 'fish'],
				['vogel', 'bird'],
				['paard', 'horse'],
				['koe', 'cow'],
			]);
			const session = new GameSession(list);
			session.getNextWord();
			expect(session.getMultipleChoiceOptions().length).toBeLessThanOrEqual(5);
		});

		it('returns only the correct answer when word list has one word', () => {
			const list = makeWordList([['hond', 'dog']]);
			const session = new GameSession(list);
			session.getNextWord();
			expect(session.getMultipleChoiceOptions()).toEqual(['dog']);
		});
	});

	describe('answerCurrentWord', () => {
		it('returns true for correct answer', () => {
			const list = makeWordList([['hond', 'dog']]);
			const session = new GameSession(list);
			session.getNextWord();
			expect(session.answerCurrentWord('dog')).toBe(true);
		});

		it('returns false for wrong answer', () => {
			const list = makeWordList([['hond', 'dog']]);
			const session = new GameSession(list);
			session.getNextWord();
			expect(session.answerCurrentWord('cat')).toBe(false);
		});
	});

	describe('getScore', () => {
		it('starts at zero', () => {
			const list = makeWordList([['hond', 'dog']]);
			const session = new GameSession(list);
			expect(session.getScore()).toEqual({ correct: 0, incorrect: 0, total: 1 });
		});

		it('tracks correct answers', () => {
			const list = makeWordList([['hond', 'dog'], ['kat', 'cat']]);
			const session = new GameSession(list);
			session.getNextWord();
			session.answerCurrentWord(session.getWords()[0].translation);
			session.getNextWord();
			session.answerCurrentWord(session.getWords()[1].translation);
			expect(session.getScore().correct).toBe(2);
			expect(session.getScore().incorrect).toBe(0);
		});

		it('tracks incorrect answers', () => {
			const list = makeWordList([['hond', 'dog']]);
			const session = new GameSession(list);
			session.getNextWord();
			session.answerCurrentWord('wrong');
			expect(session.getScore()).toEqual({ correct: 0, incorrect: 1, total: 1 });
		});

		it('reflects total word count', () => {
			const list = makeWordList([['hond', 'dog'], ['kat', 'cat'], ['vis', 'fish']]);
			const session = new GameSession(list);
			expect(session.getScore().total).toBe(3);
		});
	});
});
