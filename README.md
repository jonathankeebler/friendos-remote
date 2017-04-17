# FriendOS Remote

  An operating system that just might be your friend

## Requirements
- node v4.x

## Usage
```js
var FriendOS = require("friendos-remote");

var app = new FriendOS({
    license: "YOUR_LICENSE_KEY",
    remote: "http://friendos-remote.friendlybotinc.com:8081"
});

app.start(); 
```
**You must create the following directories and files in your project:**
- library/ *(must contain at least 1 module)*
- starters/ *(must contain at least 1 module)*
- intents.csv

## Installation

```bash
$ npm install friendos-remote
```

## Quick Start

Create your package.json

```bash
$ npm init
```

Install the library

```bash
$ npm install friendos-remote --save
```

Install some sample modules and their requires
```bash
$ bash ./node_modules/friendos-remote/scripts/setup.sh
```

Create your /app.js

```js
var FriendOS = require("friendos-remote");

var app = new FriendOS({
    license: "YOUR_LICENSE_KEY",
    remote: "http://friendos-remote.friendlybotinc.com:8081"
});

app.start(); 
```

  Start the server:

```bash
$ node app.js
```

Go to [localhost:8000/cma.html](http://localhost:8000/cma.html) and say "Hi"

## Required Files

### **intents.csv**
Each row contains a sample phrase, a comma, then the Library module that will be executed when that phrase is detected.

Sample intents.csv:
```
Hi,hello
Can you say hello to me?,hello
```

Note: A line break is required after each intent.


### **Library/**

Library modules are run when a user inputs an associated intent, or when another library module references them.

Example One: A user says "hello", a basic library modules responds with "hi".

Example Two: A user says "hello", a library module figures out if it knows the user's name, if not it triggers a second library module to get the user's name, and re-runs the first module to respond with "hi, name".

**Sample 1 library/hello.js**
```js
module.exports = {
	solve: [
		"Hi!",
		"Hello",
		"Wassup"
	]
};
```

**Sample 2 library/hello.js**
```js
module.exports = {
	entities: {
		required: ["name"]
	},
	solve: function()
	{
		if(true)
		{
			this.pass({ out: "Hi, " + name + "!" });
		}
		else
		{
			this.fail({ out: "Hi!" });
		}
		
	}
};
```

### **Starters**

Starters are triggered to run on a specific day at a specific time. They are meant to re-engage the user and function much like library modules. They can be as simple as saying "Hello, how was your weekend?", and as complex as you like. For example, you could hit an API to get a sports score and a second API to get some highlights of the game and say something like "Did you see the big win yesterday?! What did you think of the bad call by the referee?"

Starters can be marked as flippers. Flippers will run when a conversation is ongoing, but the user has not responded in a while. For example, you could say something like "Anyway, what are you doing this weekend?" 

**Sample starters/howsitgoing.js**
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
			this.fail("How are you feeling?", "mood");
		}
	},
	repeats: false,
	starter: true,
	flipper: false,
	priority: 2,
	time: "Monday-Sunday 0800-1000"
}
```

**Descriptions**

**script1/script0:** Starters can have multiple scripts that do completely different things. When triggered, the starter will pick a script randomly.

**repeats:** This indicates whether the starter should be run multiple times. You woudn't want to keep asking their name, but you would want to ask them how their day was regularly.

**starter:** Indicates whether this should be used as a starter. Set this to "false" if the output wouldn't make sense without being in an active conversation.

**flipper:** Indicates whether this should be used as a flipper. Set this to "false" if the output wouldn't make sense during an active conversation.

**priority:** This allows you to set priority for multiple starters that are set to run at the same time on the same day. 0 is the highest priority, followed by 1, 2, 3, etc.

**time:** This is when you would like the starter to run. You can include, just says of the week, just times of day, or both. The time uses a 24 hour clock. If no time is set, the starter can run any time a starter is required and will be selected randomly taking into consideration the priority of other starters available at that time, on that day.

### **Profiles**

You can save information to a user's profile, and retrieve it for use whenever you like. You can also create starters that act differently based on the information in the user's profile.

In this example, the starter looks up the name in the profile and uses it in the output, if it doesn't have the name, it asks for it and stores it using **,"name"** after the output.

```
module.exports = {
	script: function()
	{
		if(this.profile.name)
		{
			this.pass("Nice to meet you, " + this.profile.name);
		}
		else
		{
			this.fail("What's your name?", "name");
		}
	},
	repeats: false,
	flipper: true,
	starter: false,
	priority: 0
}
```

## License

  [GPLv3](LICENSE)
