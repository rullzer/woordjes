import { getWordLists } from '$lib/WordListManager';

export const prerender = true;

export async function load({ params }) {
  const { wordlist } = params;

  // Get all word lists
  const wordLists = getWordLists();
  const selectedList = wordLists.find((wl) => wl.id === wordlist);

  if (!selectedList) {
    throw new Error(`Word list "${wordlist}" not found`);
  }

  return {
    selectedList: selectedList.id,
  };
}
