# Equation graphs

## Project structure

```
.
├── back // Server
│   ├── gulpfile.js // Task runner
│   ├── package.json
│   └── src
│       ├── models // Database models
│       │   └── function.js
│       ├── modules
│       │   └── functions.js // Function module
│       └── server.js // Main server file
├── front // Client
│   ├── index.css
│   ├── index.html
│   └── index.js
└── README.md

```

## Usage
### Requirements
- `node 6+`

- `mongodb`

- `gulp`

## How to run
1. Make sure you have MongoDB running
2. `cd back && npm install`
3. `gulp`
4. Open `index.html`