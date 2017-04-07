# FriendOS Remote

  An operating system that just might be your friend

## Usage
**You must create the following files in your project:**
- library/
- starters/
- intents.csv
```js
var FriendOS = require("friendos-remote");

var app = new FriendOS({
    license: "YOUR_LICENSE_KEY"
});

app.start(); 
```

## Installation

```bash
$ npm install friendos-remote
```

## Quick Start

Create the necessary files

```bash
$ mkdir library && mkdir starters && touch intents.csv
```

Install the library

```bash
$ npm install friendos-remote
```

Create your app.js

```js
var FriendOS = require("friendos-remote");

var app = new FriendOS({
    license: "YOUR_LICENSE_KEY"
});

app.start(); 
```

  Start the server:

```bash
$ node app.js
```

## Required Files

### intents.csv
Each row contains a sample phrase, a comma, then the Library module that will be executed when that phrase is detected.

Sample intents.csv:
```
Hi,hello
Can you say hello to me?,hello
```


### Library/
Sample 1 library/hello.js
```js
module.exports = {
	solve: [
		"Hi!",
		"Hello",
		"Wassup"
	]
};
```


## License

  [MIT](LICENSE)
