# @sendanor/matrix

Our lightweight Matrix.org library written in TypeScript.

### Why?

The official SDK was too complex and bloat for OpenWRT devices and did not easily rollup as a full 
minified single file. 

Our compiled version takes space about 50kB. That's *including* all dependencies except standard 
library. It runs on the browser as well as on the NodeJS LTS v8 and up.

### It's MIT licenced

### It doesn't have many runtime dependencies

This library expects [@sendanor/typescript](https://github.com/sendanor/typescript) to be located 
in the relative path `../ts` and only required dependency it has is for [Lodash 
library](https://lodash.com/).

### It's well tested

~~Our unit tests exists beside the code. To run tests, check out our test repository 
[@sendanor/test](https://github.com/sendanor/test).~~

Well, it will be. This submodule is part of an experimental project, which still evolves much more 
unstable manner :)

### We don't have traditional releases

This project evolves directly to our git repository in an agile manner.

This git repository contains only the source code for compile time use case. It is meant to be used 
as a git submodule in a NodeJS or webpack project.

Recommended way to initialize your project is like this:

```
mkdir -p src/nor

git submodule add git@github.com:sendanor/typescript.git src/nor/ts
git config -f .gitmodules submodule.src/nor/ts.branch main

git submodule add git@github.com:sendanor/ui.git src/nor/ui
git config -f .gitmodules submodule.src/nor/ui.branch main

git submodule add git@github.com:sendanor/matrix.git src/nor/matrix
git config -f .gitmodules submodule.src/nor/matrix.branch main
```

Only required dependency is to [the Lodash library](https://lodash.com/):

```
npm install --save-dev lodash @types/lodash
```

Some of our code may use reflect metadata. It's optional otherwise.

```
npm install --save-dev reflect-metadata
```

### Stable releases available for a commercial customer

For *tailored commercial release*, you may contact [our sales](mailto:info@sendanor.fi).

General rule for pricing is 500 € (or $600) / [feature](https://github.com/sendanor/matrix/issues). 

One full stable release containing multiple components is 8000 €. The full payment includes a month 
of agile development with the customer, and a year of support for that release branch.
