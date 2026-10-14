import { describe, it, expect } from 'vitest';
import {
	countEntries,
	defaultSettings,
	findWordListData,
	getWordListData,
	toWordList,
	type PracticeSettings,
	type WordListData
} from './WordListManager';

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
		sentences: [{ word: 'I spilled my drink.', translation: 'Ik morste mijn drinken.' }],
		...overrides
	};
}

function settings(overrides: Partial<PracticeSettings> = {}): PracticeSettings {
	return { ...defaultSettings, ...overrides };
}

describe('toWordList', () => {
	it('asks words forward by default', () => {
		const list = toWordList(makeData(), defaultSettings);
		expect(list.id).toBe('test');
		expect(list.name).toBe('Test');
		expect(list.labels).toEqual({ word: 'Engels', translation: 'Nederlands' });
		expect(list.getWordPairs().map((p) => [p.word, p.reversed])).toEqual([
			['colour', false],
			['messy', false]
		]);
	});

	it('asks words the other way around', () => {
		const list = toWordList(makeData(), settings({ direction: 'reverse' }));
		expect(list.getWordPairs().map((p) => [p.word, p.translation, p.reversed])).toEqual([
			['kleur', 'colour', true],
			['slordig, rommelig', 'messy', true]
		]);
	});

	it('mixes directions', () => {
		const values = [0.1, 0.9];
		const list = toWordList(makeData(), settings({ direction: 'mixed' }), () => values.shift()!);
		expect(list.getWordPairs().map((p) => [p.word, p.reversed])).toEqual([
			['kleur', true],
			['messy', false]
		]);
	});

	it('includes extra words when asked', () => {
		const list = toWordList(makeData(), settings({ includeExtra: true }));
		const awkward = list.getWordPairs()[2];
		expect(awkward.word).toBe('awkward');
		expect(awkward.extra).toBe(true);
	});

	it('shows alternatives joined and accepts each of them', () => {
		const messy = toWordList(makeData(), defaultSettings).getWordPairs()[1];
		expect(messy.translation).toBe('slordig, rommelig');
		expect(messy.acceptedTranslations).toEqual(['slordig', 'rommelig']);

		const reversed = toWordList(makeData(), settings({ direction: 'reverse' })).getWordPairs()[1];
		expect(reversed.acceptedTranslations).toEqual(['messy']);
	});

	it('asks sentences', () => {
		const list = toWordList(makeData(), settings({ part: 'sentences' }));
		expect(list.name).toBe('Test zinnen');
		expect(list.getWordPairs().map((p) => p.word)).toEqual(['I spilled my drink.']);
	});

	it('returns an empty list when there are no sentences', () => {
		const list = toWordList(makeData({ sentences: undefined }), settings({ part: 'sentences' }));
		expect(list.getWordPairs()).toEqual([]);
	});
});

describe('countEntries', () => {
	it('counts words, extra words and sentences', () => {
		expect(countEntries(makeData())).toEqual({
			words: 2,
			extraWords: 1,
			sentences: 1,
			extraSentences: 0
		});
	});

	it('handles missing sentences', () => {
		expect(countEntries(makeData({ sentences: undefined })).sentences).toBe(0);
	});
});

describe('getWordListData', () => {
	it('loads all data files with unique ids', () => {
		const ids = getWordListData().map((data) => data.id);
		expect(ids.length).toBeGreaterThan(0);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('finds a list by id', () => {
		const first = getWordListData()[0];
		expect(findWordListData(first.id)).toBe(first);
		expect(findWordListData('does-not-exist')).toBeUndefined();
	});

	it('only contains valid word lists', () => {
		for (const data of getWordListData()) {
			for (const part of ['words', 'sentences'] as const) {
				for (const direction of ['forward', 'reverse'] as const) {
					expect(() =>
						toWordList(data, settings({ part, direction, includeExtra: true }))
					).not.toThrow();
				}
			}
		}
	});
});
