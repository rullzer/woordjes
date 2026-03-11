import { getWordLists } from '$lib/WordListManager';

export const prerender = true;

export async function load() {
	const wordLists = getWordLists();

	return {
		wordLists: wordLists.map((wordlist) => ({
			name: wordlist.name,
			id: wordlist.id,
			count: wordlist.getWordPairs().length
		}))
	};
}
