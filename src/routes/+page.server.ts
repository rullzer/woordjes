import { getWordLists } from "$lib/WordListManager";

export async function load() {
	const wordLists = getWordLists();

  	return {
    	wordLists: wordLists.map((wordlist) => ({name: wordlist.name, id: wordlist.id})),
  	};
}
