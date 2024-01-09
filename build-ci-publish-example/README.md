# build ci publish example library

This example projects is based on the following video: https://www.youtube.com/watch?v=aKTSC4D1GL8&list=PLEBCKcboIbaC7NeJ_C8kXjafGoI6_RAQI&index=30&t=6028s and uses `tsup` for building the project.


## Steps
1. Set noEmit: true in `tsconfig.json` for disabling generate any JavaScript source code, source-maps or declarations. Tsup is a separate transpiler from typescript. It is a task runner that can handle the bundling and transpilation of various formats. `tsup` can perform more advanced transpilation tasks than TypeScript. It can handle things like tree-shaking, code splitting, and minification, which can significantly improve the performance and size of your compiled code. By setting noEmit: true, you give `tsup` complete control over the transpilation process, allowing it to optimize the output for your specific needs.

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
```
  "main": "./dist/index.js",
  "module": "./dist/index",
  "types": "./dist/index.d.ts",
```




Here are additional helpful docs for this project:
- https://tsup.egoist.dev/#typescript--javascript
- https://vitest.dev/guide/debugging