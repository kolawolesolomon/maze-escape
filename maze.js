function generateMaze(size = 15, random = Math.random) {
  if (!Number.isInteger(size) || size < 2 || size > 100) throw new RangeError("Invalid size");
  const cells = Array.from({length: size * size}, () => [true,true,true,true]);
  const seen = new Set([0]), stack = [0];
  const directions = [[0,-1],[1,0],[0,1],[-1,0]];
  while (stack.length) {
    const i = stack[stack.length-1], x = i % size, y = Math.floor(i/size);
    const options = directions.map(([dx,dy],d) => ({x:x+dx,y:y+dy,d}))
      .filter(p => p.x>=0 && p.y>=0 && p.x<size && p.y<size && !seen.has(p.y*size+p.x));
    if (!options.length) { stack.pop(); continue; }
    const p = options[Math.floor(random()*options.length)], j = p.y*size+p.x;
    cells[i][p.d] = false;
    cells[j][(p.d+2)%4] = false;
    seen.add(j); stack.push(j);
  }
  return cells;
}
if (typeof module !== "undefined") module.exports = {generateMaze};
