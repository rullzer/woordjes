import { describe, it, expect } from 'vitest';
import { WordPair } from './WordPair';

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

	it('throws when accepted translations are empty', () => {
		expect(() => new WordPair('hond', 'dog', { acceptedTranslations: [] })).toThrow(
			'Accepted translations cannot be empty'
		);
		expect(() => new WordPair('hond', 'dog', { acceptedTranslations: [''] })).toThrow(
			'Accepted translations cannot be empty'
		);
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
