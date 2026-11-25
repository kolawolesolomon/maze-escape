const assert = require("node:assert/strict");
const { test } = require("node:test");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

test("keyboard and touch can solve a freshly generated maze", async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 650 }, hasTouch: true, isMobile: true });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(pathToFileURL(require.resolve("./index.html")).href);
    const status = page.locator("#status");
    assert.equal(await status.textContent(), "Moves: 0");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.keyboard.press("ArrowUp");
    assert.equal(await status.textContent(), "Moves: 0");
    const before = await page.evaluate(() => JSON.stringify(maze));
    const route = await page.evaluate(() => {
      const seen = new Set([0]);
      const queue = [[0, []]];
      for (const [cell, steps] of queue) {
        if (cell === maze.length - 1) return steps;
        maze[cell].forEach((wall, direction) => {
          const next = cell + [-size, 1, size, -1][direction];
          if (wall || seen.has(next)) return;
          seen.add(next);
          queue.push([next, [...steps, direction]]);
        });
      }
      throw new Error("Exit is unreachable");
    });
    const arrow = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
    await page.keyboard.press(arrow[route[0]]);
    assert.equal(await status.textContent(), "Moves: 1");
    await page.locator(`[data-d="${route[1]}"]`).tap();
    assert.equal(await status.textContent(), "Moves: 2");
    for (const direction of route.slice(2)) await page.keyboard.press(arrow[direction]);
    assert.equal(await status.textContent(), `Escaped in ${route.length} moves!`);
    await page.keyboard.press(arrow[(route.at(-1) + 2) % 4]);
    assert.equal(await status.textContent(), `Escaped in ${route.length} moves!`);
    await page.locator("#new").tap();
    assert.equal(await status.textContent(), "Moves: 0");
    assert.notEqual(await page.evaluate(() => JSON.stringify(maze)), before);
    assert.deepEqual(errors, []);
    await page.setViewportSize({ width: 760, height: 740 });
    await page.screenshot({ path: "maze-escape.png" });
  } finally {
    await browser.close();
  }
});
