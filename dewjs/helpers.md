### Usage
just import the file before using.

```js
import { /* functions */ } from 'dewjs/funcs';
```

### browser

Not a function. Contains name of user browser as a string.
It supports browsers - *Chrome, Firefox, Opera, Safari, IE*

```js
import { browser, BROWSERS } from 'dewjs/funcs';

if (browser === BROWSERS.CHROME) {
    console.log('this is chrome');
}
```

-------
### isType
( **value** : *Any*, **type** : *String* ) => *Boolean* | *String*

Checks type of the value. Returns result of checking as Boolean.
Function, which called with one argument will returns type of the passed value as string. If you pass array of types, then it checks value with each type in the array and returns true if value is one of this types.
*HTMLTools* - is a special type of objects produced through library html object.

- **value** - value itself.
- **type** - type as string. It supports types: *number, string, boolean, array, function, DOM, HTMLTools*.

```js
const some = [];
if (isType(some, 'array')) {
    // ...code
}

console.log(isType(some)); // array

// array of types
const other = 'hello';
if (isType(other, ['string', 'number']) {
    // ...code
}
```