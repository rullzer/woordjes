<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { getWordLists } from '$lib/WordListManager';
	import { WordList } from '$lib/WordList';
	import { GameSession } from '$lib/GameSession';
	import type { WordPair } from '$lib/WordPair';

	let session: GameSession | undefined;
  
	const wordList = page.params.wordlist;
	let selectedList: WordList | undefined;

	let currentWord: WordPair | undefined;
  	let options: string[] = [];
  	let isCorrect: boolean | undefined = undefined;
  	let hasAnswered = false;
	let score = {
		correct: 0,
		incorrect: 0
	};
	let totalWords = 0;
	let theAnswer = '';
  
	onMount(() => {
	  const lists = getWordLists();
	  selectedList = lists.find((list) => list.name === wordList);
  
	  if (!selectedList) {
		console.error('Word list not found!');
		return;
	  }

	  session = new GameSession(selectedList);
	  totalWords = selectedList?.getWordPairs().length;
	  loadNextWord();
	});

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
  </script>
  
  <main>
	{#if session && selectedList}
	  <h1>{selectedList.name}</h1>
	  <p>Goed: {score.correct}</p>
	  <p>Fout: {score.incorrect}</p>
	  <p>Voortgang: {score.correct + score.incorrect + 1} / {totalWords}</p>
	  
	  {#if currentWord}
      <h2>Woord: {currentWord.word}</h2>
      <div class="options">
        {#each options as option}
          <button
            class:correct={hasAnswered && option === currentWord.translation}
            class:incorrect={hasAnswered && !isCorrect && option === theAnswer}
            on:click={() => checkAnswer(option)}
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
        <button on:click={loadNextWord}>Volgende woord</button>
      {/if}
    {:else}
      <h2>Game Over!</h2>
      <p>Goed: {session.getScore().correct}</p>
      <p>Fout: {session.getScore().incorrect}</p>
      <button on:click={() => (location.href = '/')}>Terug naar begin</button>
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
  