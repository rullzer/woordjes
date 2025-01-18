<script lang="ts">
	const { data }: { data: { selectedList: string}} = $props();
	const selectedListId = data.selectedList;

	import { getWordLists } from '$lib/WordListManager';
	import { GameSession } from '$lib/GameSession';
	import type { WordPair } from '$lib/WordPair';

	const lists = getWordLists();
	const selectedList = lists.find((l) => l.id === selectedListId)!;

	let session = new GameSession(selectedList);


	let currentWord: WordPair | undefined = $state(undefined);
  	let options: string[] = $state([]);
  	let isCorrect: boolean | undefined = $state(undefined);
  	let hasAnswered = $state(false);
	let score = $state({
		correct: 0,
		incorrect: 0
	});
	let totalWords = selectedList.getWordPairs().length;
	let theAnswer = $state('');

	function loadNextWord() {
    	if (session) {
      		const nextWord = session.getNextWord();
      		if (nextWord) {
        		currentWord = nextWord;
        		options = session.getMultipleChoiceOptions();
        		hasAnswered = false;
        		isCorrect = undefined;
      		} else {
        		currentWord = undefined; // No more words
      		}
    	}
  	}

  	function checkAnswer(answer: string) {
    	if (!session || !currentWord) return;

		theAnswer = answer;
    	isCorrect = session.answerCurrentWord(answer);
    	hasAnswered = true;
		score = session.getScore();
  	}

	loadNextWord();
  </script>
  
  <main>
	{#if session && selectedList}
	  <h1>{selectedList.name}</h1>
	  <p>Goed: {score.correct}</p>
	  <p>Fout: {score.incorrect}</p>
	  <p>Voortgang: {score.correct + score.incorrect} / {totalWords}</p>
	  
	  {#if currentWord}
      <h2>Woord: {currentWord.word}</h2>
      <div class="options">
        {#each options as option}
          <button
            class:correct={hasAnswered && option === currentWord.translation}
            class:incorrect={hasAnswered && !isCorrect && option === theAnswer}
            onclick={() => checkAnswer(option)}
            disabled={hasAnswered}
          >
            {option}
          </button>
        {/each}
      </div>

      {#if hasAnswered}
	  	{#if isCorrect}
		  	<p>Goed gedaan!</p>
		{:else}
			<p>Helaas...</p>
		{/if}
        <button onclick={loadNextWord}>Volgende woord</button>
      {/if}
    {:else}
      <h2>Game Over!</h2>
      <p>Goed: {session.getScore().correct}</p>
      <p>Fout: {session.getScore().incorrect}</p>
      <button onclick={() => (location.href = '/')}>Terug naar begin</button>
    {/if}
	{:else}
	  <p>Loading...</p>
	{/if}
  </main>
  
  
  <style>
	main {
	  text-align: center;
	  padding: 2rem;
	}
  
	.options {
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: center;
	  gap: 1rem;
	  margin: 2rem 0;
	}
  
	button {
	  padding: 1rem 2rem;
	  font-size: 1.25rem;
	  border: 2px solid transparent;
	  border-radius: 8px;
	  background-color: #007bff;
	  color: white;
	  cursor: pointer;
	  transition: background-color 0.3s, border-color 0.3s;
	}
  
	button.correct {
	  border-color: green;
	  background-color: #28a745;
	  border-width: 5px;
	}
  
	button.incorrect {
	  border-color: red;
	  background-color: #dc3545;
	  border-width: 5px;
	}
  
	button:disabled {
	  cursor: not-allowed;
	  background-color: #6c757d;
	}
  </style>
  