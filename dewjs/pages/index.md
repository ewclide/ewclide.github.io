# Dew.js

> This is experimental javaScript library

The project is a combination of solutions and ideas accumulated over few years.
I would also like to note that some solutions that may have analogues were developed by chance :) but have the right to exist.

## Features

- ```Speed``` - some methods faster than jquery analogues (select, append ...)
- ```JS as HTML``` - control UI throught JSON objects
- ```DOM API``` - manage DOM objects without connecting other libraries
- ```Async``` - create and organize asynchronous objects
- ```Binding``` - organize objects interaction throught binding
- ```Access``` - hide or publish fields and methods of classes
- ```Templating``` - create views throught templates
- Many other good things ;)

## Install

For using this library on the site just get a local copy using git or press on **[download][1]**.
And link script, which located in dist folder, into your page.
Also you can link bundle from cdn:

```html
<script src="https://cdn.jsdelivr.net/gh/ewclide/dewjs/dist/dew.min.js"></script>
```

For creating your projects use npm

```bash
npm install dewjs --save-dev
```

And setup your webpack config, for working with dewjs babel plugin.

```js
const rule = {
	test: /\.js$/,
	exclude: /node_modules/,
	use: {
		loader: 'babel-loader',
		options: {
			plugins: ['dewjs/babel-plugin']
		}
	}
}
```

This plugin allows you to write short import paths with imports only specified functions to your final bundle

```js
/* using with babel plugin */
import { randi, idGetter, capitalize } from 'dewjs/helper';

/* using without babel plugin */
import randi from 'dewjs/core/helper/rand-i';
import idGetter from 'dewjs/core/helper/id-getter';
import capitalize from 'dewjs/core/helper/capitalize';
```

## Usage

:bear: :beer: Enjoy using it!

```js
import { html } from 'dewjs/common';

(async () => {
	await html.ready;

	const hello = html.create('h1').text('Hello world!');
	html.body.append(hello);
})()
```

[1]: https://github.com/ewclide/dewjs/archive/master.zip  "download"