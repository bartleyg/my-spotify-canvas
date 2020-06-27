<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');

	let modal;
</script>

<div class="modal-background" on:click={close}></div>
<div class="modal" role="dialog" aria-modal="true" bind:this={modal}>
	<h3>Your browser requires your interaction
    <br/>before audio can play.</h3>
	<button on:click={close}>OK</button>
</div>

<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		background: rgba(255, 255, 255, 0.5); /* white half opacity */
	}
	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		z-index: 11;
		width: calc(100vw - 4em);
		max-width: 32em;
		max-height: calc(100vh - 4em);
		overflow: auto;
		padding: 1em;
		border-radius: 0.2em;
    background: #1d1e26; /* dark */
    border: 4px solid #72FFE4; /* blue */
    text-align: center;
	}
  .modal > button {
    background: #72FFE4; /* blue */
    font-size: 18px;
    color: #2a2c37; /* blackish */
    padding: 12px 24px;
    margin-bottom: 18px;
  }
</style>
