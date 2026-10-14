<script lang="ts">
	type ListSummary = {
		name: string;
		id: string;
		words: number;
		extraWords: number;
		sentences: number;
	};
	const { data }: { data: { wordLists: ListSummary[] } } = $props();
	const wordLists = data.wordLists;

	function describe(list: ListSummary) {
		const parts = [`${list.words} woorden`];
		if (list.extraWords > 0) parts.push(`${list.extraWords} extra`);
		if (list.sentences > 0) parts.push(`${list.sentences} zinnen`);
		return parts;
	}
</script>

<main>
	<div class="hero">
		<h1>Woordjes</h1>
		<p class="subtitle">Kies een lijst om mee te oefenen</p>
	</div>
	<div class="word-lists">
		{#each wordLists as list}
			<a href="/game/{list.id}" class="word-list-card">
				<span class="list-name">{list.name}</span>
				<span class="list-count">
					{#each describe(list) as part (part)}
						<span>{part}</span>
					{/each}
				</span>
			</a>
		{/each}
	</div>
</main>

<style>
	main {
		font-family: Arial, sans-serif;
		text-align: center;
		padding: 2rem;
		max-width: 500px;
		margin: 0 auto;
	}

	.hero {
		margin-bottom: 2.5rem;
	}

	.hero h1 {
		font-size: 3rem;
		margin: 0 0 0.5rem;
		color: #007bff;
	}

	.subtitle {
		color: #666;
		font-size: 1rem;
		margin: 0;
	}

	.word-lists {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.word-list-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		background-color: #f8f9fa;
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
		transition:
			background-color 0.2s,
			box-shadow 0.2s;
	}

	.word-list-card:hover {
		background-color: #e9f2ff;
		box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
	}

	.list-name {
		font-size: 1.1rem;
		font-weight: bold;
		color: #333;
	}

	.list-count {
		font-size: 0.875rem;
		color: #999;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		white-space: nowrap;
	}
</style>
