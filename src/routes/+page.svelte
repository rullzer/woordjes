<script lang="ts">
	import { getWordLists } from "$lib/WordListManager";

	const lists = getWordLists();

	const selectList = (listName: string) => {
    	alert(`You selected: ${listName}`);
  	};
</script>

<main>
	<h1>Kies je woordjes</h1>
	<div class="word-lists">
	  	{#each lists as list}
			<button class="word-list-button" on:click={() => selectList(list.name)}>
		  		{list.name}
			</button>
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
  