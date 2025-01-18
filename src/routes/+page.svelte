<script lang="ts">
	const { data }: { data: { wordLists: {name: string, id: string}[]}} = $props();
	const wordLists = data.wordLists;
</script>

<main>
	<h1>Kies je woordjes</h1>
	<div class="word-lists">
	  	{#each wordLists as list}
			<a href="/game/{list.id}">
			<button class="word-list-button">
		  		{list.name}
			</button>
			</a>
	  	{/each}
	</div>
</main>


<style>
	main {
	  text-align: center;
	  padding: 2rem;
	}
  
	.word-lists {
	  display: flex;
	  flex-direction: column;
	  gap: 1rem;
	  align-items: center;
	}
  
	.word-list-button {
	  padding: 1rem 2rem;
	  font-size: 1.25rem;
	  border: none;
	  background-color: #007BFF;
	  color: white;
	  border-radius: 8px;
	  cursor: pointer;
	  transition: background-color 0.3s;
	}
  
	.word-list-button:hover {
	  background-color: #0056b3;
	}
  </style>
  