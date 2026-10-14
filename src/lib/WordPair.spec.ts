import { describe, it, expect } from 'vitest';
import { normalizeAnswer, WordPair } from './WordPair';

describe('WordPair', () => {
	it('stores word and translation', () => {
		const pair = new WordPair('hond', 'dog');
		expect(pair.word).toBe('hond');
		expect(pair.translation).toBe('dog');
	});

	it('throws when word is empty', () => {
		expect(() => new WordPair('', 'dog')).toThrow('Word and translation cannot be empty');
	});

	it('throws when translation is empty', () => {
		expect(() => new WordPair('hond', '')).toThrow('Word and translation cannot be empty');
	});

	it('is not extra by default', () => {
		expect(new WordPair('hond', 'dog').extra).toBe(false);
	});

	it('can be marked as extra', () => {
		expect(new WordPair('hond', 'dog', { extra: true }).extra).toBe(true);
	});

	it('accepts only the translation by default', () => {
		expect(new WordPair('hond', 'dog').acceptedTranslations).toEqual(['dog']);
	});

	it('stores accepted translations', () => {
		const pair = new WordPair('messy', 'slordig, rommelig', {
			acceptedTranslations: ['slordig', 'rommelig']
		});
		expect(pair.acceptedTranslations).toEqual(['slordig', 'rommelig']);
	});

	it('is not reversed by default', () => {
		expect(new WordPair('hond', 'dog').reversed).toBe(false);
		expect(new WordPair('dog', 'hond', { reversed: true }).reversed).toBe(true);
	});

	it('throws when accepted translations are empty', () => {
		expect(() => new WordPair('hond', 'dog', { acceptedTranslations: [] })).toThrow(
			'Accepted translations cannot be empty'
		);
		expect(() => new WordPair('hond', 'dog', { acceptedTranslations: [''] })).toThrow(
			'Accepted translations cannot be empty'
		);
	});

	it('throws when the options do not include the translation', () => {
		expect(
			() => new WordPair('___ sour.', 'They are', { options: ['It is', 'It is not'] })
		).toThrow('Options must include the translation');
	});

	it('is always multiple choice for sentences and grammar', () => {
		expect(new WordPair('hond', 'dog').alwaysMultipleChoice).toBe(false);
		expect(new WordPair('a', 'b', { sentence: true }).alwaysMultipleChoice).toBe(true);
		expect(new WordPair('a', 'b', { options: ['b', 'c'] }).alwaysMultipleChoice).toBe(true);
	});

	describe('accepts', () => {
		it('accepts the exact translation', () => {
			expect(new WordPair('lenen', 'to borrow').accepts('to borrow')).toBe(true);
		});

		it('ignores capitals, surrounding spaces and a full stop at the end', () => {
			const pair = new WordPair('lenen', 'to borrow');
			expect(pair.accepts('  To Borrow.  ')).toBe(true);
			expect(pair.accepts('TO BORROW!')).toBe(true);
		});

		it('requires the rest to be exactly right', () => {
			const pair = new WordPair('lenen', 'to borrow');
			expect(pair.accepts('borrow')).toBe(false);
			expect(pair.accepts('to borow')).toBe(false);
			expect(pair.accepts('')).toBe(false);
		});

		it('accepts each alternative and the full text', () => {
			const pair = new WordPair('messy', 'slordig, rommelig', {
				acceptedTranslations: ['slordig', 'rommelig']
			});
			expect(pair.accepts('slordig')).toBe(true);
			expect(pair.accepts('Rommelig')).toBe(true);
			expect(pair.accepts('slordig, rommelig')).toBe(true);
			expect(pair.accepts('netjes')).toBe(false);
		});
	});

	describe('normalizeAnswer', () => {
		it('collapses spaces inside the answer', () => {
			expect(normalizeAnswer('to   borrow')).toBe('to borrow');
		});

		it('keeps punctuation inside the answer', () => {
			expect(normalizeAnswer("Don't.")).toBe("don't");
		});
	});

	describe('equals', () => {
		it('returns true for identical pairs', () => {
			const a = new WordPair('hond', 'dog');
			const b = new WordPair('hond', 'dog');
			expect(a.equals(b)).toBe(true);
		});

		it('returns false when word differs', () => {
			const a = new WordPair('hond', 'dog');
			const b = new WordPair('kat', 'dog');
			expect(a.equals(b)).toBe(false);
		});

		it('returns false when translation differs', () => {
			const a = new WordPair('hond', 'dog');
			const b = new WordPair('hond', 'cat');
			expect(a.equals(b)).toBe(false);
		});
	});
});
