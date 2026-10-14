import { describe, it, expect } from 'vitest';
import {
	countEntries,
	defaultSettings,
	findWordListData,
	getWordListData,
	parseSettings,
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
	it('asks words and sentences forward by default', () => {
		const list = toWordList(makeData(), defaultSettings);
		expect(list.id).toBe('test');
		expect(list.name).toBe('Test');
		expect(list.labels).toEqual({ word: 'Engels', translation: 'Nederlands' });
		expect(list.getWordPairs().map((p) => [p.word, p.reversed, p.sentence])).toEqual([
			['colour', false, false],
			['messy', false, false],
			['I spilled my drink.', false, true]
		]);
	});

	it('asks words the other way around', () => {
		const list = toWordList(makeData({ sentences: undefined }), settings({ direction: 'reverse' }));
		expect(list.getWordPairs().map((p) => [p.word, p.translation, p.reversed])).toEqual([
			['kleur', 'colour', true],
			['slordig, rommelig', 'messy', true]
		]);
	});

	it('mixes directions', () => {
		const values = [0.1, 0.9];
		const list = toWordList(
			makeData({ sentences: undefined }),
			settings({ direction: 'mixed' }),
			() => values.shift()!
		);
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

	it('leaves out extra sentences unless asked', () => {
		const data = makeData({
			sentences: [{ word: 'It was awkward.', translation: 'Het was ongemakkelijk.', extra: true }]
		});
		expect(
			toWordList(data, defaultSettings)
				.getWordPairs()
				.some((p) => p.sentence)
		).toBe(false);
		expect(
			toWordList(data, settings({ includeExtra: true }))
				.getWordPairs()
				.some((p) => p.sentence)
		).toBe(true);
	});
});

describe('grammar', () => {
	const grammar = [
		{
			title: 'It is / They are',
			rule: 'Gaat het over 1 ding? Dan gebruik je it is.',
			questions: [
				{
					sentence: '___ sour.',
					hint: 'Ze zijn niet zuur.',
					answer: 'They are not',
					options: ['It is', 'They are not']
				}
			]
		}
	];

	it('adds grammar questions after the words and sentences', () => {
		const pairs = toWordList(makeData({ grammar }), defaultSettings).getWordPairs();
		const question = pairs[pairs.length - 1];
		expect(question.word).toBe('___ sour.');
		expect(question.translation).toBe('They are not');
		expect(question.options).toEqual(['It is', 'They are not']);
		expect(question.label).toBe('Grammatica: It is / They are');
		expect(question.hint).toBe('Ze zijn niet zuur.');
		expect(question.explanation).toBe('Gaat het over 1 ding? Dan gebruik je it is.');
	});

	it('never reverses grammar questions', () => {
		const pairs = toWordList(
			makeData({ grammar }),
			settings({ direction: 'reverse' })
		).getWordPairs();
		expect(pairs[pairs.length - 1].reversed).toBe(false);
		expect(pairs[pairs.length - 1].word).toBe('___ sour.');
	});

	it('counts grammar questions', () => {
		expect(countEntries(makeData({ grammar })).grammar).toBe(1);
	});
});

describe('parseSettings', () => {
	it('keeps valid settings', () => {
		const valid = { direction: 'mixed', mode: 'typing', includeExtra: true };
		expect(parseSettings(valid)).toEqual(valid);
	});

	it('falls back to defaults for missing or invalid values', () => {
		expect(parseSettings(null)).toEqual(defaultSettings);
		expect(parseSettings('nonsense')).toEqual(defaultSettings);
		expect(parseSettings({ direction: 'reverse', part: 'words', includeExtra: 'yes' })).toEqual({
			...defaultSettings,
			direction: 'reverse'
		});
	});
});

describe('countEntries', () => {
	it('counts words, extra words and sentences', () => {
		expect(countEntries(makeData())).toEqual({
			words: 2,
			extraWords: 1,
			sentences: 1,
			grammar: 0,
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
			for (const direction of ['forward', 'reverse'] as const) {
				expect(() => toWordList(data, settings({ direction, includeExtra: true }))).not.toThrow();
			}
		}
	});
});
