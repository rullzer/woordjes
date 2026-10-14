import { describe, it, expect } from 'vitest';
import { getWordLists, toWordLists, type WordListData } from './WordListManager';

function makeData(overrides: Partial<WordListData> = {}): WordListData {
	return {
		id: 'test',
		name: 'Test',
		for: 'Teske',
		date: '2026-10-10',
		labels: { word: 'Engels', translation: 'Nederlands' },
		words: [
			{ word: 'colour', translation: 'kleur' },
			{ word: 'messy', translation: ['slordig', 'rommelig'] },
			{ word: 'awkward', translation: 'ongemakkelijk', extra: true }
		],
		...overrides
	};
}

describe('toWordLists', () => {
	it('creates a list and a reversed list', () => {
		const lists = toWordLists(makeData());
		expect(lists.map((l) => l.id)).toEqual(['test', 'test_rev']);
		expect(lists.map((l) => l.name)).toEqual(['Test', 'Test andersom']);
		expect(lists[1].labels).toEqual({ word: 'Nederlands', translation: 'Engels' });
	});

	it('leaves out extra words', () => {
		const [list, reversed] = toWordLists(makeData());
		expect(list.getWordPairs().map((p) => p.word)).toEqual(['colour', 'messy']);
		expect(reversed.getWordPairs().map((p) => p.translation)).toEqual(['colour', 'messy']);
	});

	it('shows alternatives joined and accepts each of them', () => {
		const [list, reversed] = toWordLists(makeData());
		const messy = list.getWordPairs()[1];
		expect(messy.translation).toBe('slordig, rommelig');
		expect(messy.acceptedTranslations).toEqual(['slordig', 'rommelig']);

		const reversedMessy = reversed.getWordPairs()[1];
		expect(reversedMessy.word).toBe('slordig, rommelig');
		expect(reversedMessy.acceptedTranslations).toEqual(['messy']);
	});

	it('creates separate lists for sentences', () => {
		const lists = toWordLists(
			makeData({
				sentences: [{ word: 'I spilled my drink.', translation: 'Ik morste mijn drinken.' }]
			})
		);
		expect(lists.map((l) => l.id)).toEqual(['test', 'test_rev', 'test_zinnen', 'test_zinnen_rev']);
		expect(lists[2].name).toBe('Test zinnen');
		expect(lists[3].name).toBe('Test zinnen andersom');
		expect(lists[3].getWordPairs()[0].word).toBe('Ik morste mijn drinken.');
	});

	it('skips lists without words', () => {
		const lists = toWordLists(
			makeData({ words: [{ word: 'awkward', translation: 'ongemakkelijk', extra: true }] })
		);
		expect(lists).toEqual([]);
	});
});

describe('getWordLists', () => {
	it('loads all data files with unique ids', () => {
		const ids = getWordLists().map((l) => l.id);
		expect(ids.length).toBeGreaterThan(0);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
