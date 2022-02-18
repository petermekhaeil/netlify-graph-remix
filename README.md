# netlify-graph-remix

Demo of [Remix](https://remix.run/) using [Netlify Graph](https://github.com/netlify/labs/tree/main/features/graph/documentation) to fetch data from GitHub. When a new issue is created in this repository, it will be listed as a blog post.

Demo: [https://netlify-graph-remix.netlify.app/](https://netlify-graph-remix.netlify.app/)

## Setup

1. Install the latest version of the [Netlify CLI](https://www.netlify.com/products/dev/):

```sh
npm i -g netlify-cli@latest
```

2. Sign up and log in to Netlify:

```sh
ntl login
```

3. Create a new site:

```sh
ntl init
```

## Development

Start a local CLI session with Netlify Dev:

```sh
ntl dev --graph
```

## Learn More

- [Netlify Graph](https://github.com/netlify/labs/tree/main/features/graph/documentation)
- [Remix Docs](https://remix.run/docs)
