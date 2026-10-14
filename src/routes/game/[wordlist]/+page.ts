import { findWordListData } from '$lib/WordListManager';

export const prerender = true;

export async function load({ params }) {
	const { wordlist } = params;

	if (!findWordListData(wordlist)) {
		throw new Error(`Word list "${wordlist}" not found`);
	}

	return {
		selectedList: wordlist
	};
}
