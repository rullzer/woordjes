<script lang="ts">
	import { onMount } from 'svelte';
	const { data }: { data: { selectedList: string}} = $props();
	const selectedListId = data.selectedList;

	import { getWordLists } from '$lib/WordListManager';
	import { GameSession } from '$lib/GameSession';
	import { WordList } from '$lib/WordList';
	import type { WordPair } from '$lib/WordPair';

	let session: GameSession | null = $state(null);
	let currentWord: WordPair | undefined = $state(undefined);
  	let options: string[] = $state([]);
  	let isCorrect: boolean | undefined = $state(undefined);
  	let hasAnswered = $state(false);
	let score = $state({ correct: 0, incorrect: 0, total: 0 });
	let theAnswer = $state('');
	let listName = $state('');

	function loadNextWord() {
    	if (session) {
      		const nextWord = session.getNextWord();
      		if (nextWord) {
        		currentWord = nextWord;
        		options = session.getMultipleChoiceOptions();
        		hasAnswered = false;
        		isCorrect = undefined;
      		} else {
        		currentWord = undefined;
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

	function startSession(wordList: WordList) {
		session = new GameSession(wordList);
		listName = wordList.name;
		score = session.getScore();
		currentWord = undefined;
		loadNextWord();
	}

	function retryWrongWords() {
		if (!session) return;
		const wrongWords = session.getWrongWords();
		const retryList = new WordList(listName, selectedListId + '_retry');
		retryList.addWordPairs(wrongWords);
		startSession(retryList);
	}

	onMount(() => {
		const lists = getWordLists();
		const selectedList = lists.find((l) => l.id === selectedListId)!;
		startSession(selectedList);
	});
  </script>
  
  <main>
	{#if session}
		<div class="header">
	  		<h1>{listName}</h1>
			<div class="scores">
				<p>Goed: {score.correct}</p>
				<p>Fout: {score.incorrect}</p>
			</div>
		</div>
	  
		<div class="progress-container">
			<div class="progress-bar">
				<div class="progress-fill" style="width: {((score.correct + score.incorrect) / score.total) * 100}%"></div>
			</div>
			<span class="progress-count">{score.correct + score.incorrect} / {score.total}</span>
		</div>

		{#if currentWord}
		<div class="word">
			<h2>{currentWord.word}</h2>
		</div>
		<div class="options">
			{#each options as option (option)}
				<button
            		class:correct={hasAnswered && option === currentWord.translation}
            		class:incorrect={hasAnswered && !isCorrect && option === theAnswer}
            		class:neutral={hasAnswered && option !== currentWord.translation && option !== theAnswer}
            		onclick={() => checkAnswer(option)}
            		disabled={hasAnswered}
          		>
            		{option}
          		</button>
			{/each}
		</div>
      

      {#if hasAnswered}
        <div class="feedback" class:feedback-correct={isCorrect} class:feedback-incorrect={!isCorrect}>
          {isCorrect ? 'Goed gedaan! ✓' : 'Helaas... ✗'}
        </div>
        <button class="next-button" onclick={loadNextWord}>Volgende woord →</button>
      {/if}
		{:else}
      {@const percentage = Math.round((score.correct / score.total) * 100)}
      {@const message = percentage === 100 ? 'Perfecte score! 🎉' : percentage >= 80 ? 'Goed gedaan!' : percentage >= 60 ? 'Aardig, maar er is nog ruimte voor verbetering.' : 'Nog even oefenen!'}
      <div class="game-over">
        <h2>{message}</h2>
        <p class="percentage">{percentage}%</p>
        <p>Goed: {score.correct} / {score.total}</p>
        <p>Fout: {score.incorrect} / {score.total}</p>
        {#if score.incorrect > 0}
          <button onclick={retryWrongWords}>Opnieuw met foute woordjes ({score.incorrect})</button>
        {/if}
        <button onclick={() => (location.href = '/')}>Terug naar begin</button>
      </div>
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

	@media (max-width: 600px) {
		main {
			padding: 0.75rem;
		}

		.header h1 {
			font-size: 0.9rem;
		}

		.scores p {
			font-size: 0.75rem;
		}

		.word h2 {
			font-size: 2rem;
		}
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.header h1 {
		font-size: 1.1rem;
		margin: 0;
	}

	.scores {
		display: flex;
		gap: 1rem;
	}

	.scores p {
		margin: 0;
		font-size: 0.875rem;
		color: #666;
	}

	.progress-container {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.progress-bar {
		flex: 1;
		height: 10px;
		background-color: #e0e0e0;
		border-radius: 5px;
		overflow: hidden;
	}

	.progress-count {
		font-size: 0.875rem;
		color: #666;
		white-space: nowrap;
	}

	.progress-fill {
		height: 100%;
		background-color: #007bff;
		border-radius: 5px;
		transition: width 0.3s ease;
	}

	.word {
		background-color: #f8f9fa;
		border-radius: 12px;
		padding: 2rem 1.5rem;
		margin: 1rem 0 1.5rem;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
	}

	.word h2 {
		font-size: 2.5rem;
		margin: 0;
		color: #333;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.feedback {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 1.1rem;
		font-weight: bold;
		margin-top: 1rem;
	}

	.feedback-correct {
		background-color: #d4edda;
		color: #155724;
	}

	.feedback-incorrect {
		background-color: #f8d7da;
		color: #721c24;
	}

	.next-button {
		background-color: #fd7e14;
		font-size: 1.25rem;
		margin-top: 0.5rem;
	}

	.next-button:hover {
		background-color: #e96b02;
	}

	.game-over {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 2rem;
	}

	.percentage {
		font-size: 4rem;
		font-weight: bold;
		color: #007bff;
		margin: 0;
	}

	button {
		background-color: #007bff;
		color: white;
		border: none;
		padding: 1.25rem 1rem;
		font-size: 1.1rem;
		border-radius: 10px;
		cursor: pointer;
		width: 100%;
		transition: background-color 0.3s ease;
	}

	button:hover {
		background-color: #0056b3;
	}

	button:disabled {
		cursor: not-allowed;
	}

	button.correct {
		background-color: #28a745;
	}

	button.incorrect {
		background-color: #dc3545;
	}

	button.neutral:disabled {
		background-color: #ccc;
	}
  </style>
  