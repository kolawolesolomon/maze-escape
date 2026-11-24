const {test}=require("node:test");
const assert=require("node:assert/strict");
const {generateMaze}=require("./maze");
test("maze is connected, bounded and has no cycles",()=>{
 for(const n of [2,5,15,30]){
  const m=generateMaze(n), seen=new Set([0]), stack=[0];
  let openings=0;
  for(let i=0;i<m.length;i++){
   const x=i%n,y=Math.floor(i/n);
   const neighbors=[y>0?i-n:-1,x<n-1?i+1:-1,y<n-1?i+n:-1,x>0?i-1:-1];
   neighbors.forEach((j,d)=>{
    if(j<0) assert.equal(m[i][d],true);
    else assert.equal(m[i][d],m[j][(d+2)%4]);
    if(!m[i][d]) openings++;
   });
  }
  while(stack.length){const i=stack.pop();m[i].forEach((w,d)=>{const j=i+[-n,1,n,-1][d];if(!w&&!seen.has(j)){seen.add(j);stack.push(j);}});}
  assert.equal(seen.size,n*n);assert.equal(openings/2,n*n-1);
 }
});
test("invalid dimensions rejected",()=>assert.throws(()=>generateMaze(1),RangeError));
