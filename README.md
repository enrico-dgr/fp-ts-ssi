# fp-ts-ssi

## Installation

Commands to install along with peer dependencies:

npm

```terminal
npm install @enrico-dgr/fp-ts-ssi fp-ts @enrico-dgr/fp-ts-fs
```

yarn

```terminal
yarn add @enrico-dgr/fp-ts-ssi fp-ts @enrico-dgr/fp-ts-fs
```

## Usage

Here is an example using the `compileHtmlFiles` function:

```html
<!-- index.html -->
<!-- #echo var="title" -->
```

```html
<!-- about.html -->
<!-- #set var="title" value="Your Website" -->
<!-- #echo var="title" -->
```

```js
import { compileHtmlFiles } from '@enrico-dgr/fp-ts-ssi'
import path from 'path'

const options = {
  files: [
    path.join(__dirname, './relative/path/to/index.html'),
    path.join(__dirname, './relative/path/to/about.html'),
  ],
  params: {
    title: 'My Website',
  },
}

let filesInfos;

const res = compileHtmlFiles(options)

if (res._tag === 'Right') {
  // Successfully retrieved the array with outputs
  filesInfos = res.right;
} else {
  throw new Error('');
}

console.log(filesInfos[0].name)
// index.html
console.log(filesInfos[0].content)
// <!-- index.html -->
// 
// My Website

console.log(filesInfos[1].name)
// about.html
console.log(filesInfos[1].content)
// <!-- about.html -->
//
// Your Website
```

The `compileHtmlFiles` function takes an options object with a `files` array of file paths to compile, and an optional `params` object for passing global parameters. It returns an Either with the compiled HTML outputs or an Error.
