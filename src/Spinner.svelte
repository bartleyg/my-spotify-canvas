<div>
  <h3 class="green">Loading...</h3>
  <img class="rotate" src="spotify.png" alt="spinner">
</div>

<style>
  .green {
    color: #4AFF68;
  }
  .rotate {
    animation: rotation 1s infinite linear;
  }
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
</style>
