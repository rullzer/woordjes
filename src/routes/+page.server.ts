import { countEntries, getWordListData } from '$lib/WordListManager';

export const prerender = true;

export async function load() {
	return {
		wordLists: getWordListData().map((data) => ({
			name: data.name,
			id: data.id,
			...countEntries(data)
		}))
	};
}
