// modules/tree.js
(function(){
  window.initTree = function(root){
    root.innerHTML = `
      <div style="display:flex;gap:8px;align-items:center">
        <button id="tree-dfs" class="action">DFS (Preorder)</button>
        <button id="tree-bfs" class="action">BFS</button>
        <button id="tree-reset" class="action">Reset</button>
      </div>
      <svg id="tree-svg" viewBox="0 0 1000 320" style="width:100%;height:320px;margin-top:10px"></svg>
    `;
    const svg = root.querySelector('#tree-svg');
    // sample tree
    const tree = { val:'A', left:{val:'B', left:{val:'D'}, right:{val:'E'}}, right:{val:'C', left:{val:'F'}, right:{val:'G'}} };
    let nodes = [];
    function layout(n,x,y,spread){ if(!n) return; n.x=x; n.y=y; nodes.push(n); layout(n.left, x-spread, y+80, spread/1.7); layout(n.right, x+spread, y+80, spread/1.7); }
    function draw(){
      svg.innerHTML = ''; nodes=[]; layout(tree, 500, 40, 240);
      nodes.forEach(n=>{
        if(n.left){
          const l=document.createElementNS('http://www.w3.org/2000/svg','line');
          l.setAttribute('x1', n.x); l.setAttribute('y1', n.y+18); l.setAttribute('x2', n.left.x); l.setAttribute('y2', n.left.y-6);
          l.setAttribute('stroke','#ccc'); l.setAttribute('stroke-width',2); svg.appendChild(l);
        }
        if(n.right){
          const l=document.createElementNS('http://www.w3.org/2000/svg','line');
          l.setAttribute('x1', n.x); l.setAttribute('y1', n.y+18); l.setAttribute('x2', n.right.x); l.setAttribute('y2', n.right.y-6);
          l.setAttribute('stroke','#ccc'); l.setAttribute('stroke-width',2); svg.appendChild(l);
        }
      });
      nodes.forEach(n=>{
        const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r', 18); c.setAttribute('fill', '#1768c3');
        svg.appendChild(c);
        const t=document.createElementNS('http://www.w3.org/2000/svg','text');
        t.setAttribute('x', n.x); t.setAttribute('y', n.y+5); t.setAttribute('text-anchor','middle'); t.setAttribute('fill', '#fff'); t.textContent = n.val;
        svg.appendChild(t);
      });
    }
    function animateOrder(order){
      let i=0; const speed = Math.max(10, 220 - document.getElementById('speed').value);
      function step(){
        draw();
        if(i>=order.length){ log('Traversal ended: ' + order.join(' -> ')); return; }
        const v = order[i];
        const node = nodes.find(n=>n.val === v);
        if(node){
          const circ = document.createElementNS('http://www.w3.org/2000/svg','circle');
          circ.setAttribute('cx', node.x); circ.setAttribute('cy', node.y); circ.setAttribute('r', 20); circ.setAttribute('fill', '#ff8c00');
          svg.appendChild(circ);
          const t = document.createElementNS('http://www.w3.org/2000/svg','text'); t.setAttribute('x', node.x); t.setAttribute('y', node.y+5); t.setAttribute('text-anchor','middle'); t.setAttribute('fill', '#fff'); t.textContent = node.val; svg.appendChild(t);
        }
        log('Visited: ' + v);
        i++; setTimeout(step, speed);
      }
      step();
    }
    document.getElementById('tree-dfs').onclick = ()=> {
      const ord = [];
      function preorder(n){ if(!n) return; ord.push(n.val); preorder(n.left); preorder(n.right); }
      preorder(tree); animateOrder(ord);
    };
    document.getElementById('tree-bfs').onclick = ()=> {
      const ord = []; const q=[tree];
      while(q.length){ const c = q.shift(); ord.push(c.val); if(c.left) q.push(c.left); if(c.right) q.push(c.right); }
      animateOrder(ord);
    };
    document.getElementById('tree-reset').onclick = draw;
    function log(t){ const obs = document.getElementById('obs'); if(!obs) return; const d=document.createElement('div'); d.textContent = '• ' + t; obs.prepend(d); if(obs.childElementCount>8) obs.removeChild(obs.lastElementChild); }
    draw();
    window.currentSim = { start: ()=> log('Use DFS/BFS buttons'), pause: ()=> {}, reset: ()=> { draw(); log('Reset'); } };
  };
})();
