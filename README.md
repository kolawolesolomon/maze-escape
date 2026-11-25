# Maze Escape

[![Tests](https://github.com/kolawolesolomon/maze-escape/actions/workflows/tests.yml/badge.svg)](https://github.com/kolawolesolomon/maze-escape/actions/workflows/tests.yml)

A dependency-free JavaScript and Canvas game. Randomized depth-first search generates a connected maze with a unique route from the start to the exit.

## Setup and use

Open `index.html` in a browser. Use arrow keys or the on-screen touch controls to reach the gold exit. The game counts successful moves. Select **New maze** to start over.

## Tests

Use Node.js 22 for the generation tests.

```sh
node --test maze.test.js
```

For browser testing, install Google Chrome and the test-only Playwright dependency. These instructions use a POSIX shell.

```sh
npm install --no-save --package-lock=false playwright@1.58.2
node --test browser.test.cjs
```

Generation tests cover connectivity, reciprocal walls, closed borders, absence of cycles and invalid sizes. The Chrome scenario checks keyboard and touch, move totals, escaping, regeneration and a narrow viewport. It captures `maze-escape.png`.

## Limitations

The board currently uses a fixed 15×15 size and keeps progress in memory for the current page.
