# DevQuest Frontend

## Prerequisites

* node + npm

## Setup

1. Enable `corepack` to install the correct version of `pnpm`
```sh
corepack enable
```
2. Install dependencies
```sh
pnpm install
```
3. Start dev server
```sh
pnpm dev
```

OR

3. Build Docker image


## Docker

Building Docker image example:
```sh
docker build . --tag capstone-frontend
```

Running Docker image example:
```sh
docker run -d --rm -e NUXT_PUBLIC_API_BASE=http://myhost.com/api --name capstone-frontend -p 3000:3000 capstone-frontend
```

Set `NUXT_PUBLIC_API_BASE` to override default backend base url of `http://localhost:8080`
