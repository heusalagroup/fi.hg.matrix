**Join our [Discord](https://discord.gg/UBTrHxA78f) to discuss about our software!**

# @heusalagroup/fi.hg.matrix

Our lightweight Matrix.org library written in TypeScript.

### Why?

The official SDK was too complex and bloat for OpenWRT devices and did not easily rollup as a full 
minified single file. 

Our compiled version takes space about 50kB. That's *including* all dependencies except standard 
library. It runs on the browser as well as on the NodeJS LTS v8 and up.

### It doesn't have many runtime dependencies

This library expects [@heusalagroup/fi.hg.core](https://github.com/heusalagroup/fi.hg.core) to be located 
in the relative path `../ts` and only required dependency it has is for [Lodash 
library](https://lodash.com/).

### We don't have traditional releases

This project evolves directly to our git repository in an agile manner.

This git repository contains only the source code for compile time use case. It is meant to be used 
as a git submodule in a NodeJS or webpack project.

Recommended way to initialize your project is like this:

```
mkdir -p src/fi/hg

git submodule add git@github.com:heusalagroup/fi.hg.core.git src/fi/hg/core
git config -f .gitmodules submodule.src/fi/hg/core.branch main

git submodule add git@github.com:heusalagroup/fi.hg.matrix.git src/fi/hg/matrix
git config -f .gitmodules submodule.src/fi/hg/matrix.branch main
```

Only required dependency is to [the Lodash library](https://lodash.com/):

```
npm install --save-dev lodash @types/lodash
```

Some of our code may use reflect metadata. It's optional otherwise.

```
npm install --save-dev reflect-metadata
```

### License

Copyright (c) Heusala Group. All rights reserved. Licensed under the MIT License (the "[License](./LICENSE)");
