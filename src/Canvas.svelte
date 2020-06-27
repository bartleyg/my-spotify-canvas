<script>
	import { createEventDispatcher } from 'svelte';
	import { playingSoundId, enableIndex, scrollPlayEnabled } from './stores.js';
	import Spinner from './Spinner.svelte';

	export let canvas, index, mobile;	// props

	const dispatch = createEventDispatcher();

	let audioElement;	// DOM <audio> element for component instance
	let enabled, videoOnScreen, videoCanPlay = false;

	enableIndex.subscribe(value => {
		if (value === index) enabled = true;
	});

	function loadNextHandler() {
		if (!videoCanPlay) {
			console.log('video loaded enough to load next', index + 1);
			enableIndex.set(index + 1);
			videoCanPlay = true;
		}
	}

	function playSound() {
		let soundId = canvas.uri;
		// first stop other sound playing
		if ($playingSoundId && soundId !== $playingSoundId) {
		  let playingSound = document.getElementById($playingSoundId);
		  playingSound.pause();
		}
		// <audio> may not be loaded yet when touchScroller triggers this
		if (audioElement) {
			console.log('attempting to play', index, soundId);
			audioElement.volume = 0.5;	// 50% volume
			let promise = audioElement.play();
			if (promise) {
		    promise.then(_ => {
	        console.log('autoplay started for', index, soundId);
					playingSoundId.set(soundId);
		    }).catch(catchId => {
					console.log('autoplay prevented for', uri, 'catchId:', catchId);
	        console.table(catchId);
	        // autoplay prevented. show modal for user interaction to start autoplay music
	        // emit event to parent to show modal so that user can start playback
					dispatch('playblocked', Object.entries(catchId));
		    });
			} else {
				console.log('play promise false?', promise, 'for', index, soundId);
			}
		} else {
			console.log('<audio> tag not found to play', index, soundId);
		}
	}

	function stopSound() {
		audioElement.pause();
		// stop any other sound playing
		if ($playingSoundId && canvas.uri !== $playingSoundId) {
		  let playingSound = document.getElementById($playingSoundId);
		  playingSound.pause();
		}
		playingSoundId.set(null);
	}

	// mobile only
	function playStopSound() {
		let soundId = canvas.uri;
		// if this id is playing, pause it
		// TODO: check playing on actual audioElement
		if ($playingSoundId && soundId === $playingSoundId) {
			audioElement.pause();
			playingSoundId.set(null);
			scrollPlayEnabled.set(false);
		}
		// if some other id is playing, pause it, and play this id
		else if ($playingSoundId && soundId !== $playingSoundId) {
		  let playingSound = document.getElementById($playingSoundId);
		  playingSound.pause();
			audioElement.volume = 0.5;	// 50% volume
			audioElement.play();
			playingSoundId.set(soundId);
			scrollPlayEnabled.set(true);
		}
		// nothing is playing so play this id
		else {
			audioElement.volume = 0.5;	// 50% volume
			audioElement.play();
			playingSoundId.set(soundId);
			scrollPlayEnabled.set(true);
		}
  }
</script>

{#if enabled || index === 0}
	<div class="canvas">
		{#if mobile}
			<video
		    src={canvas.canvasUrl}
		    type="video/mp4"
		    muted
		    autoplay
				playsinline
		    loop
				on:loadeddata="{() => videoOnScreen = true}"
				on:canplaythrough={loadNextHandler}
				on:click={playStopSound}
		  >
		  </video>
		{:else}
			<video
				src={canvas.canvasUrl}
				type="video/mp4"
				muted
				autoplay
				preload="auto"
				playsinline
				loop
				on:loadeddata="{() => videoOnScreen = true}"
				on:canplaythrough={loadNextHandler}
				on:mouseover={playSound}
				on:mouseout={stopSound}
				on:click={stopSound}
			>
			</video>
		{/if}
		{#if videoOnScreen}
		  <a
		    href={canvas.uri}
				on:mouseover="{playSound}"
				on:mouseout="{() => stopSound(canvas.uri)}"
		  >
		    {canvas.name}
		  </a>
		{/if}
		{#if !videoOnScreen}
			<Spinner/>
		{/if}
	</div>
{/if}

<style>
	.play-button {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-size: 30%;
		background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij4KICAgIDxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTExLjc1IDM1LjcyMlYxMi4yNzhhMS44NzUgMS44NzUgMCAwIDEgMi44MjYtMS42MTZsMTkuOTI3IDExLjcyMmExLjg3NSAxLjg3NSAwIDAgMSAwIDMuMjMyTDE0LjU3NiAzNy4zMzhhMS44NzUgMS44NzUgMCAwIDEtMi44MjYtMS42MTZ6Ii8+Cjwvc3ZnPgo=);
		background-repeat: no-repeat;
		background-position: center center;
	}
  .canvas {
    position: relative;
  }
	.canvas a {
		position: absolute;
		left: 5px;
		z-index: 1;
		background: rgba(0, 0, 0, 0.2);
		padding: 2px 3px 2px 3px;
	}
	/* mobile screens */
	@media screen and (max-width: 414px) {
		.canvas video {
			width: 100vw;
		}
		.canvas a {
	    top: calc(100% - 30px);
	  }
	}
	/* desktop & tablet screens */
	@media screen and (min-width: 415px) {
		.canvas video {
			height: 667px;
		}
		.canvas a {
	    top: 637px;
	  }
	}
</style>
