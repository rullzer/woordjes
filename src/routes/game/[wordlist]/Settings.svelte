<script lang="ts">
	import {
		countEntries,
		type Direction,
		type Mode,
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
	let mode: Mode = $state(settings.mode);
	// svelte-ignore state_referenced_locally
	let includeExtra = $state(settings.includeExtra);

	const counts = $derived(countEntries(data));
	const hasSentences = $derived(counts.sentences + counts.extraSentences > 0);
	const hasGrammar = $derived(counts.grammar > 0);
	const extraCount = $derived(counts.extraWords + counts.extraSentences);
	const total = $derived(
		counts.words + counts.sentences + counts.grammar + (includeExtra ? extraCount : 0)
	);

	const directions: { value: Direction; label: string }[] = $derived([
		{ value: 'forward', label: `${data.labels.word} → ${data.labels.translation}` },
		{ value: 'reverse', label: `${data.labels.translation} → ${data.labels.word}` },
		{ value: 'mixed', label: 'Door elkaar' }
	]);
</script>

<div class="settings">
	<h1>{data.name}</h1>

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

	<fieldset>
		<legend>Hoe wil je oefenen?</legend>
		<div class="choices">
			<button class:selected={mode === 'choice'} onclick={() => (mode = 'choice')}>
				Meerkeuze
			</button>
			<button class:selected={mode === 'typing'} onclick={() => (mode = 'typing')}> Typen </button>
		</div>
		{#if (hasSentences || hasGrammar) && mode === 'typing'}
			<p class="hint">
				{hasSentences && hasGrammar
					? 'Zinnen en grammatica blijven meerkeuze.'
					: hasGrammar
						? 'Grammatica blijft meerkeuze.'
						: 'Zinnen blijven meerkeuze.'}
			</p>
		{/if}
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
		onclick={() => onstart({ direction, mode, includeExtra })}
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

	.hint {
		margin: 0.5rem 0 0;
		font-size: 0.875rem;
		color: #999;
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
