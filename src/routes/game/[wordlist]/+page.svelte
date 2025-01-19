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
	let score = $state(session.getScore());
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
		<div class="header">
	  		<h1>{selectedList.name}</h1>
			<div class="scores">
				<p>Goed: {score.correct}</p>
				<p>Fout: {score.incorrect}</p>
				<p>Voortgang: {score.correct + score.incorrect} / {score.total}</p>
			</div>
		</div>
	  
		<div class="word">
			<h2>Woord: {currentWord?.word || 'Klaar!'}</h2>
		</div>
	  
		{#if currentWord}
		<div class="options">
			{#each options as option (option)}
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
		font-family: Arial, sans-serif;
		text-align: center;
		padding: 2rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.scores p {
		margin: 0.5rem;
		font-size: 1rem;
	}

	.word h2 {
		font-size: 1.5rem;
		margin: 1rem 0;
		color: #333;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	button {
		background-color: #007bff;
		color: white;
		border: none;
		padding: 1rem;
		font-size: 1rem;
		border-radius: 5px;
		cursor: pointer;
		width: 100%;
		transition: background-color 0.3s ease;
	}

	button:hover {
		background-color: #0056b3;
	}

	button:disabled {
		cursor: not-allowed;
		background-color: #ccc;
	}

	button.correct {
		border: 2px solid green;
	}

	button.incorrect {
		border: 2px solid red;
	}
  </style>
  