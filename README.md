# Docker Promote Image

## About

GitHub Action to promote or re-tag Docker image with other tags.

- [x] Same Repository
- [x] Different Repositories
- [x] Multiple Different Repositories
- [x] Same Repository (Private)
- [x] Different Repositories (Private)
- [x] Multiple Different Repositories (Private)

## Examples

### Same repository

```yaml
name: 'promote image'
on: 
  workflow_dispatch

jobs:
  promote-image: # make sure the action works on a clean machine without building
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: docker/login-action@v1.9.0
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - uses: euphoricsystems/docker-promote-image@v2
        with:
         src: docker.io/node:16
         destinations: |
          docker.io/u4ic/test-node:node-16
          docker.io/u4ic/test-node:latest
          docker.io/u4ic/test-node2:latest


```

### Different/Multiple Repositories

```yaml
name: 'promote image'
on: 
  workflow_dispatch

jobs:
  promote-image: # make sure the action works on a clean machine without building
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - uses: docker/login-action@v1.9.0
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - uses: docker/login-action@v1.9.0
        name: Login to GitHub Container Registry        
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - uses: euphoricsystems/docker-promote-image@v2
        with:
         src: docker.io/node:16
         destinations: |
          ghcr.io/u4ic/test-node:node-16
          ghcr.io/u4ic/test-node:latest
          docker.io/u4ic/test-node2:latest


```
