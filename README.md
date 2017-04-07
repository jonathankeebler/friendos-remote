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

### **intents.csv**
Each row contains a sample phrase, a comma, then the Library module that will be executed when that phrase is detected.

Sample intents.csv:
```
Hi,hello
Can you say hello to me?,hello
```


### **Library/**
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

Sample 2 library/hello.js
```js
module.exports = {
	solve: function()
	{
		if(true)
		{
			this.pass("Hi!");
		}
		else
		{
			this.fail("Why did you ask me that?");
		}
		
	}
};
```

### **Starters**

Sample starters/howsitgoing.js
```js
module.exports = {
	script0: ["How's it going?"],
	script1: function()
	{
		if(this.profile.mood)
		{
			this.pass("I'm feeling " + this.profile.mood + " too");
		}
		else
		{
			this.fail("How are you feeling?", mood);
		}
	},
	repeats: false,
	starter: true,
	flipper: false,
	priority: 2,
	time: "Monday-Sunday 0800-1000"
}
```

## License

  [MIT](LICENSE)
