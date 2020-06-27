# My Spotify Canvas

[My Spotify Canvas](https://my-spotify-canvas.now.sh) is a dynamically updated audio video canvas of my recently played Spotify music.

Built with:
* Spotify Web API
* Spotify Canvas API I reverse engineered
* Protobufs
* Node.js Express serverless
* Svelte
* Zeit Now

Install:

```shell
$ yarn install
```

Local development:

```shell
$ yarn build && now dev
```

Deploy staging:

```shell
$ yarn build && now
```

Deploy production:

```shell
$ yarn build && now --prod
```
