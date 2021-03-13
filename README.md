# remark-uml

> ⚠️ Since PlantUML is written in Java, this module can't currently be used on the browser.
> Investigations are currently being made to try to compile PlantUML to WASM and run it anywhere.

**remark** plugin to compile PlantUML syntax to either images or ASCII art.

## Install

With npm:
```
npm install remark-uml
```

With yarn:
```
yarn add remark-uml
```

## Use

Say we have the following file, `example.md`:

```md
# This is my PlantUML diagram

@startuml
participant Bob
actor Alice

Bob -> Alice : hello
Alice -> Bob : Is it ok?
@enduml

**Pretty neat, huh?**
```

And our script, `example.js`, looks as follows:

```js
const fs = require('fs');
const remark = require('remark');
const uml = require('remark-uml');

remark()
  .use(uml, { format: 'txt' })
  .process(fs.readFileSync('example.md'))
  .then(output => console.log(output.toString()))
```

Now, running `node example` yields:

~~~md
# This is my PlantUML diagram

```uml
                      ,-.  
                      `-'  
                      /|\  
     ,---.             |   
     |Bob|            / \  
     `-+-'           Alice 
       |    hello      |   
       |-------------->|   
       |               |   
       |  Is it ok?    |   
       |<--------------|   
     ,-+-.           Alice 
     |Bob|            ,-.  
     `---'            `-'  
                      /|\  
                       |   
                      / \  
```

**Pretty neat, huh?**
~~~

Note that all the options can also be overridden per diagram by passing a JSON immediately after `@startuml`.
For example, if you want to generate some diagrams as an image and others as an ASCII art, you can do it in this way:

```md
**SVG:**

@startuml{"format": "svg"}
participant Bob
actor Alice

Bob -> Alice : hello
Alice -> Bob : Is it ok?
@enduml

**PNG:**

@startuml{"format": "png"}
participant Bob
actor Alice

Bob -> Alice : hello
Alice -> Bob : Is it ok?
@enduml

**ASCII:**

@startuml{"format": "txt"}
participant Bob
actor Alice

Bob -> Alice : hello
Alice -> Bob : Is it ok?
@enduml

**Unicode:**

@startuml{"format": "utxt"}
participant Bob
actor Alice

Bob -> Alice : hello
Alice -> Bob : Is it ok?
@enduml
```

As a result, you will get the following output:

---

**SVG:**

<svg xmlns="http://www.w3.org/2000/svg" height="251" preserveAspectRatio="none" style="width:122px;height:251px" width="122"><defs><filter height="300%" id="a" width="300%" x="-1" y="-1"><feGaussianBlur result="blurOut" stdDeviation="2"/><feColorMatrix in="blurOut" result="blurOut2" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .4 0"/><feOffset dx="4" dy="4" in="blurOut2" result="blurOut3"/><feBlend in="SourceGraphic" in2="blurOut3"/></filter></defs><path style="stroke:#a80036;stroke-width:1;stroke-dasharray:5,5" d="M27 88.488v78.621m72.5-78.621v78.621"/><path fill="#FEFECE" filter="url(#a)" style="stroke:#a80036;stroke-width:1.5" d="M5 53h40v30.488H5z"/><text font-family="sans-serif" font-size="14" lengthAdjust="spacingAndGlyphs" textLength="26" x="12" y="73.535">Bob</text><path fill="#FEFECE" filter="url(#a)" style="stroke:#a80036;stroke-width:1.5" d="M5 166.109h40v30.488H5z"/><text font-family="sans-serif" font-size="14" lengthAdjust="spacingAndGlyphs" textLength="26" x="12" y="186.644">Bob</text><text font-family="sans-serif" font-size="14" lengthAdjust="spacingAndGlyphs" textLength="33" x="80.5" y="85.535">Alice</text><circle cx="100" cy="15" fill="#FEFECE" filter="url(#a)" style="stroke:#a80036;stroke-width:2" r="8"/><path d="M100 23v27M87 31h26m-13 19L87 65m13-15 13 15" fill="none" filter="url(#a)" style="stroke:#a80036;stroke-width:2"/><text font-family="sans-serif" font-size="14" lengthAdjust="spacingAndGlyphs" textLength="33" x="80.5" y="179.644">Alice</text><circle cx="100" cy="192.598" fill="#FEFECE" filter="url(#a)" style="stroke:#a80036;stroke-width:2" r="8"/><path d="M100 200.598v27m-13-19h26m-13 19-13 15m13-15 13 15" fill="none" filter="url(#a)" style="stroke:#a80036;stroke-width:2"/><path fill="#A80036" style="stroke:#a80036;stroke-width:1" d="m88 115.799 10 4-10 4 4-4z"/><path style="stroke:#a80036;stroke-width:1" d="M27 119.799h67"/><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="31" x="34" y="115.057">hello</text><path fill="#A80036" style="stroke:#a80036;stroke-width:1" d="m38 145.11-10 4 10 4-4-4z"/><path style="stroke:#a80036;stroke-width:1" d="M32 149.109h67"/><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="49" x="44" y="144.367">Is it ok?</text></svg>

**PNG:**

![](data:image/png;base64,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)

**ASCII:**

```
                      ,-.  
                      `-'  
                      /|\  
     ,---.             |   
     |Bob|            / \  
     `-+-'           Alice 
       |    hello      |   
       |-------------->|   
       |               |   
       |  Is it ok?    |   
       |<--------------|   
     ,-+-.           Alice 
     |Bob|            ,-.  
     `---'            `-'  
                      /|\  
                       |   
                      / \  
```

**Unicode:**

```
                      ┌─┐  
                      ║"│  
                      └┬┘  
                      ┌┼┐  
     ┌───┐             │   
     │Bob│            ┌┴┐  
     └─┬─┘           Alice 
       │    hello      │   
       │──────────────>│   
       │               │   
       │  Is it ok?    │   
       │<──────────────│   
     ┌─┴─┐           Alice 
     │Bob│            ┌─┐  
     └───┘            ║"│  
                      └┬┘  
                      ┌┼┐  
                       │   
                      ┌┴┐  
```

---

## API

### `remark().use(uml[, options])`

##### `options`

###### `options.format`

The output format of the UML diagrams.

Possible values are:
- `svg`: Inline SVG;
- `png`: Inline base64-encoded PNG;
- `txt`: code block containing the diagram as ASCII art;
- `utxt`: same as `txt`, but using Unicode characters to make the output prettier.

Default value is `svg`.

###### `options.optimize`

Whether to optimize or not the output. Currently only used if `options.format` is set to `svg`.

Possible values are:
- `true`: Optimize using default options (i.e. `{ multipass: true }`);
- `Object`: Optimize using custom options. These options are passed directly to SVGO;
- `false | null`: Disable optimizations (not recommended).

Default value is `true`.

###### `options.languageName`

The language name to give to the output code block. Used only if `options.format` is set to `txt` or `utxt`.

It can be any `string`, or a falsy value to disable the language name and make the code block generic.

Default value is `uml`.
