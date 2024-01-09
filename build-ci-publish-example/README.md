# build ci publish example library

This example projects is based on the following video: https://www.youtube.com/watch?v=aKTSC4D1GL8&list=PLEBCKcboIbaC7NeJ_C8kXjafGoI6_RAQI&index=30&t=6028s and uses `tsup` for building the project.


## Steps
1. Set noEmit: true in `tsconfig.json` for disabling generate any JavaScript source code, source-maps or declarations. Tsup is a separate transpiler from typescript. It is a task runner that can handle the bundling and transpilation of various formats. `tsup` can perform more advanced transpilation tasks than TypeScript. It can handle things like tree-shaking, code splitting, and minification, which can significantly improve the performance and size of your compiled code. By setting `noEmit: true`, you give `tsup` complete control over the transpilation process, allowing it to optimize the output for your specific needs.

2. Add a build script with tsup and a lint check. `tsc` can be used here because of `noEmit: true` the Typescript code is still analyzed and typechecked.
```json
"build": "tsup src/index.ts --format cjs,esm --dts",
"lint": "tsc",
```
3. add ci pipeline with test in `./github/workflows/main.yml`. Since this is currently a mono repo, also the nodejs setup github action must be configured with a cache dependency path:
```yml
- uses: actions/setup-node@v3
    with:
      node-version: 20.x
      cache: "pnpm"
      cache-dependency-path: "build-ci-publish-example/pnpm-lock.yaml"
```
4. Adjust and set the index modules, index file and types in `package.json`:
```json
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
```

5. create npm account if not already done on https://www.npmjs.com/
6. Create an access token in the npm profile top right and => access token and safe it in the guithub repo as a github repo secret
7. Add changeset library and initialize it for release changes: `pnpm add -D @changesets/cli && pnpm changeset init`. Whenever you want to publish new changes  do `pnpm changeset` and give it a name.
8. Add a release script, which will lint, test, build and publish the libary to `package.json`
```json
"release": "pnpm run lint && pnpm run test && pnpm run build && changeset publish"
```
9. Add `publish.yml` as a new github action, which uses changesets in an github action
```yml
name: CI
on: 
    push: 
        branches: 
            - "**"

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: pnpm/action-setup@v2
              with:
                version: 8
            - uses: actions/setup-node@v3
              with:
                node-version: 20.x
                cache: "pnpm"
                cache-dependency-path: "build-ci-publish-example/pnpm-lock.yaml"
            - run: cd build-ci-publish-example && pnpm install --frozen-lockfile
            - name: Create Release Pull Request or Publish to npm
              id: changesets
              uses: changesets/action@v1
              with:
                # This expects you to have a script called release which does a build for your packages and calls changeset publish
                publish: cd build-ci-publish-example && pnpm run release
              env:
                GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
                NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```
10. Add an `.nvmrc` file containing the node version
11. Add a `vite.config.mts` ([CJS is deprecated](https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated)) file and import it `vitest/dist/config`. This will make Node interpret the file as an ESM file using TypeScript syntax. The `vitest/config` import from the video is therefore also deprecated. So the vite config should look like this:
```typescript
import { defineConfig } from "vitest/config";


// vite.config.js
export default  defineConfig ({
    test: {}
    // config options
})
```
12. if you want to publish it to public npmjs set in `package.json`
```json 
private: false
```
13. In the created `.changeset/config.json` set `"access": "public"` for publishing these changesets
14. In your github repo settings choose `Settings` -> Actions -> General -> workflow permissions and set it to `Read and write permissions` and check the box `Allow GitHub Actions to create and approve pull requests`



Here are additional helpful docs for this project:
- https://tsup.egoist.dev/#typescript--javascript
- https://vitest.dev/guide/debugging
- https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md
- https://github.com/changesets/action?tab=readme-ov-file#custom-publishing