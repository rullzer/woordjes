<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	const { data }: { data: { selectedList: string } } = $props();
	const selectedListId = data.selectedList;

	import {
		defaultSettings,
		findWordListData,
		parseSettings,
		toWordList,
		type PracticeSettings,
		type WordListData
	} from '$lib/WordListManager';
	import { GameSession } from '$lib/GameSession';
	import { WordList } from '$lib/WordList';
	import type { WordListLabels } from '$lib/WordList';
	import type { WordPair } from '$lib/WordPair';
	import Settings from './Settings.svelte';

	const settingsKey = `woordjes-settings-${selectedListId}`;

	let listData: WordListData | undefined = $state(undefined);
	let settings: PracticeSettings = $state(defaultSettings);

	let session: GameSession | null = $state(null);
	let currentWord: WordPair | undefined = $state(undefined);
	let options: string[] = $state([]);
	let isCorrect: boolean | undefined = $state(undefined);
	let hasAnswered = $state(false);
	let score = $state({ correct: 0, incorrect: 0, total: 0 });
	let theAnswer = $state('');
	let typed = $state('');
	let input: HTMLInputElement | undefined = $state(undefined);
	// Sentences are always multiple choice
	const isTyping = $derived.by(() => settings.mode === 'typing' && currentWord?.sentence === false);
	let listName = $state('');
	let listFor = $state('');
	let listDate = $state('');
	let listLabels = $state<WordListLabels>({ word: '', translation: '' });

	function loadNextWord() {
		if (session) {
			const nextWord = session.getNextWord();
			if (nextWord) {
				currentWord = nextWord;
				options = session.getMultipleChoiceOptions();
				hasAnswered = false;
				isCorrect = undefined;
				typed = '';
				// Keep the keyboard open between typed words
				setTimeout(() => input?.focus());
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

	function submitTyped(event: SubmitEvent) {
		event.preventDefault();
		if (hasAnswered) {
			loadNextWord();
		} else if (typed.trim() !== '') {
			checkAnswer(typed);
		}
	}

	function startSession(wordList: WordList) {
		session = new GameSession(wordList);
		listName = wordList.name;
		listFor = wordList.for_;
		listDate = wordList.date;
		listLabels = wordList.labels;
		score = session.getScore();
		currentWord = undefined;
		loadNextWord();
	}

	function retryWrongWords() {
		if (!session) return;
		const wrongWords = session.getWrongWords();
		const retryList = new WordList(
			listName,
			selectedListId + '_retry',
			listFor,
			listDate,
			listLabels
		);
		retryList.addWordPairs(wrongWords);
		startSession(retryList);
	}

	function loadSettings(): PracticeSettings {
		try {
			return parseSettings(JSON.parse(localStorage.getItem(settingsKey) ?? 'null'));
		} catch {
			// No (valid) stored settings, use the defaults
		}
		return defaultSettings;
	}

	function start(newSettings: PracticeSettings) {
		if (!listData) return;
		settings = newSettings;
		try {
			localStorage.setItem(settingsKey, JSON.stringify(newSettings));
		} catch {
			// Not being able to remember the settings is fine
		}
		startSession(toWordList(listData, newSettings));
	}

	function changeSettings() {
		session = null;
	}

	onMount(() => {
		listData = findWordListData(selectedListId);
		settings = loadSettings();
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
				<div
					class="progress-fill"
					style="width: {((score.correct + score.incorrect) / score.total) * 100}%"
				></div>
			</div>
			<span class="progress-count">{score.correct + score.incorrect} / {score.total}</span>
		</div>

		{#if currentWord}
			{#key currentWord.word}
				<div
					class="word"
					class:shake={hasAnswered && !isCorrect}
					in:fly={{ x: 100, duration: 250 }}
				>
					<p class="direction">
						{currentWord.reversed
							? `${listLabels.translation} → ${listLabels.word}`
							: `${listLabels.word} → ${listLabels.translation}`}
					</p>
					<h2>{currentWord.word}</h2>
				</div>
			{/key}
			{#if isTyping}
				<form class="typing" onsubmit={submitTyped}>
					<input
						bind:this={input}
						bind:value={typed}
						class:correct={hasAnswered && isCorrect}
						class:incorrect={hasAnswered && !isCorrect}
						readonly={hasAnswered}
						placeholder="Typ hier je antwoord"
						autocomplete="off"
						autocapitalize="off"
						spellcheck="false"
						{...{ autocorrect: 'off' }}
					/>
					{#if !hasAnswered}
						<button type="submit" disabled={typed.trim() === ''}>Controleer</button>
					{/if}
				</form>
			{:else}
				<div class="options">
					{#each options as option (option)}
						{#if !hasAnswered || option === currentWord.translation || option === theAnswer}
							<button
								class:correct={hasAnswered && option === currentWord.translation}
								class:incorrect={hasAnswered && !isCorrect && option === theAnswer}
								onclick={() => checkAnswer(option)}
								disabled={hasAnswered}
							>
								{option}
							</button>
						{/if}
					{/each}
				</div>
			{/if}

			{#if hasAnswered}
				<div
					class="feedback"
					class:feedback-correct={isCorrect}
					class:feedback-incorrect={!isCorrect}
				>
					{isCorrect ? 'Goed gedaan! ✓' : 'Helaas... ✗'}
					{#if isTyping}
						<p class="solution">{currentWord.translation}</p>
					{/if}
				</div>
				<button class="next-button" onclick={loadNextWord}>Volgende →</button>
			{/if}
		{:else}
			{@const percentage = Math.round((score.correct / score.total) * 100)}
			{@const message =
				percentage === 100
					? 'Perfecte score! 🎉'
					: percentage >= 80
						? 'Goed gedaan!'
						: percentage >= 60
							? 'Aardig, maar er is nog ruimte voor verbetering.'
							: 'Nog even oefenen!'}
			<div class="game-over">
				<h2>{message}</h2>
				<p class="percentage">{percentage}%</p>
				<p>Goed: {score.correct} / {score.total}</p>
				<p>Fout: {score.incorrect} / {score.total}</p>
				{#if score.incorrect > 0}
					<div class="wrong-answers">
						<h3>Foute woordjes:</h3>
						{#each session.getWrongWords() as pair}
							<div class="wrong-pair">
								<span class="wrong-word">{pair.word}</span>
								<span class="wrong-arrow">→</span>
								<span class="wrong-translation">{pair.translation}</span>
							</div>
						{/each}
					</div>
					<button onclick={retryWrongWords}>Opnieuw met foute woordjes ({score.incorrect})</button>
				{/if}
				<button class="secondary" onclick={changeSettings}>Andere instellingen</button>
				<button class="secondary" onclick={() => (location.href = '/')}>Terug naar begin</button>
			</div>
		{/if}
	{:else if listData}
		{#key settings}
			<Settings data={listData} {settings} onstart={start} />
		{/key}
	{:else}
		<p>Loading...</p>
	{/if}
</main>

<style>
	main {
		font-family: Arial, sans-serif;
		text-align: center;
		padding: 2rem;
		padding-bottom: 2rem;
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
		overflow: hidden;
	}

	.word.shake {
		animation: shake 0.4s ease;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-8px);
		}
		40% {
			transform: translateX(8px);
		}
		60% {
			transform: translateX(-6px);
		}
		80% {
			transform: translateX(6px);
		}
	}

	.direction {
		margin: 0 0 0.5rem;
		font-size: 0.875rem;
		color: #999;
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

	.typing {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.typing input {
		font-size: 1.4rem;
		padding: 1rem;
		border: 2px solid #ccc;
		border-radius: 10px;
		text-align: center;
		width: 100%;
		box-sizing: border-box;
	}

	.typing input:focus {
		outline: none;
		border-color: #007bff;
	}

	.typing input.correct {
		border-color: #28a745;
		background-color: #d4edda;
	}

	.typing input.incorrect {
		border-color: #dc3545;
		background-color: #f8d7da;
		text-decoration: line-through;
	}

	.solution {
		margin: 0.5rem 0 0;
		font-size: 1.4rem;
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

	.wrong-answers {
		background-color: #f8f9fa;
		border-radius: 10px;
		padding: 1rem 1.5rem;
		text-align: left;
	}

	.wrong-answers h3 {
		margin: 0 0 0.75rem;
		font-size: 1rem;
		color: #666;
	}

	.wrong-pair {
		display: flex;
		gap: 0.5rem;
		padding: 0.4rem 0;
		border-bottom: 1px solid #e0e0e0;
		font-size: 1rem;
	}

	.wrong-pair:last-child {
		border-bottom: none;
	}

	.wrong-word {
		font-weight: bold;
		flex: 1;
	}

	.wrong-arrow {
		color: #999;
	}

	.wrong-translation {
		flex: 1;
		color: #dc3545;
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

	button.secondary {
		background-color: #6c757d;
	}

	button.secondary:hover {
		background-color: #5a6268;
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
</style>
