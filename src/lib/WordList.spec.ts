import { describe, it, expect } from 'vitest';
import { WordList } from './WordList';
import { WordPair } from './WordPair';

const testLabels = { word: 'Nederlands', translation: 'Engels' };

describe('WordList', () => {
	it('stores name and id', () => {
		const list = new WordList('Dieren', 'dieren', 'Test', '2026-01-01', testLabels);
		expect(list.name).toBe('Dieren');
		expect(list.id).toBe('dieren');
	});

	it('starts empty', () => {
		const list = new WordList('Dieren', 'dieren', 'Test', '2026-01-01', testLabels);
		expect(list.getWordPairs()).toHaveLength(0);
	});

	it('adds a word pair', () => {
		const list = new WordList('Dieren', 'dieren', 'Test', '2026-01-01', testLabels);
		list.addWordPair(new WordPair('hond', 'dog'));
		expect(list.getWordPairs()).toHaveLength(1);
	});

	it('does not add duplicate word pairs', () => {
		const list = new WordList('Dieren', 'dieren', 'Test', '2026-01-01', testLabels);
		list.addWordPair(new WordPair('hond', 'dog'));
		list.addWordPair(new WordPair('hond', 'dog'));
		expect(list.getWordPairs()).toHaveLength(1);
	});

	it('adds multiple word pairs at once', () => {
		const list = new WordList('Dieren', 'dieren', 'Test', '2026-01-01', testLabels);
		list.addWordPairs([new WordPair('hond', 'dog'), new WordPair('kat', 'cat')]);
		expect(list.getWordPairs()).toHaveLength(2);
	});

	it('deduplicates when adding multiple pairs', () => {
		const list = new WordList('Dieren', 'dieren', 'Test', '2026-01-01', testLabels);
		list.addWordPairs([
			new WordPair('hond', 'dog'),
			new WordPair('hond', 'dog'),
			new WordPair('kat', 'cat')
		]);
		expect(list.getWordPairs()).toHaveLength(2);
	});
});
