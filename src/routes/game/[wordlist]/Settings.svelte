<script lang="ts">
	import {
		countEntries,
		type Direction,
		type Part,
		type PracticeSettings,
		type WordListData
	} from '$lib/WordListManager';

	const {
		data,
		settings,
		onstart
	}: {
		data: WordListData;
		settings: PracticeSettings;
		onstart: (settings: PracticeSettings) => void;
	} = $props();

	// The form starts from the given settings and is edited locally
	// svelte-ignore state_referenced_locally
	let direction: Direction = $state(settings.direction);
	// svelte-ignore state_referenced_locally
	let part: Part = $state(settings.part);
	// svelte-ignore state_referenced_locally
	let includeExtra = $state(settings.includeExtra);

	const counts = $derived(countEntries(data));
	const hasSentences = $derived(counts.sentences + counts.extraSentences > 0);
	const extraCount = $derived(part === 'sentences' ? counts.extraSentences : counts.extraWords);
	const total = $derived(
		(part === 'sentences' ? counts.sentences : counts.words) + (includeExtra ? extraCount : 0)
	);

	const directions: { value: Direction; label: string }[] = $derived([
		{ value: 'forward', label: `${data.labels.word} → ${data.labels.translation}` },
		{ value: 'reverse', label: `${data.labels.translation} → ${data.labels.word}` },
		{ value: 'mixed', label: 'Door elkaar' }
	]);
</script>

<div class="settings">
	<h1>{data.name}</h1>

	{#if hasSentences}
		<fieldset>
			<legend>Wat wil je oefenen?</legend>
			<div class="choices">
				<button class:selected={part === 'words'} onclick={() => (part = 'words')}>
					Woordjes
				</button>
				<button class:selected={part === 'sentences'} onclick={() => (part = 'sentences')}>
					Zinnen
				</button>
			</div>
		</fieldset>
	{/if}

	<fieldset>
		<legend>Welke kant op?</legend>
		<div class="choices">
			{#each directions as option (option.value)}
				<button
					class:selected={direction === option.value}
					onclick={() => (direction = option.value)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	</fieldset>

	{#if extraCount > 0}
		<fieldset>
			<legend>Extra moeilijke (blauwe) woordjes</legend>
			<div class="choices">
				<button class:selected={!includeExtra} onclick={() => (includeExtra = false)}>
					Overslaan
				</button>
				<button class:selected={includeExtra} onclick={() => (includeExtra = true)}>
					Meedoen ({extraCount})
				</button>
			</div>
		</fieldset>
	{/if}

	<button
		class="start"
		disabled={total === 0}
		onclick={() => onstart({ direction, part, includeExtra })}
	>
		Start ({total})
	</button>
	<a href="/" class="back">← Terug naar begin</a>
</div>

<style>
	.settings {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	h1 {
		font-size: 1.5rem;
		margin: 0;
		color: #333;
	}

	fieldset {
		border: none;
		margin: 0;
		padding: 0;
	}

	legend {
		font-size: 0.95rem;
		color: #666;
		margin-bottom: 0.5rem;
		padding: 0;
	}

	.choices {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	button {
		background-color: #f8f9fa;
		color: #333;
		border: 2px solid #e0e0e0;
		padding: 1rem;
		font-size: 1.05rem;
		border-radius: 10px;
		cursor: pointer;
		width: 100%;
		transition:
			background-color 0.2s,
			border-color 0.2s;
	}

	button:hover {
		background-color: #e9f2ff;
	}

	button.selected {
		background-color: #e9f2ff;
		border-color: #007bff;
		color: #0056b3;
		font-weight: bold;
	}

	.start {
		background-color: #fd7e14;
		border-color: #fd7e14;
		color: white;
		font-size: 1.25rem;
		font-weight: bold;
	}

	.start:hover {
		background-color: #e96b02;
	}

	.start:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.back {
		color: #666;
		text-decoration: none;
	}
</style>
