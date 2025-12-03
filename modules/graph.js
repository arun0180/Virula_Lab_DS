// modules/graph.js
(function(){
  window.initGraph = function(root){
    root.innerHTML = `
      <div style="display:flex;gap:8px;align-items:center">
        <label>Traversal: <select id="graph-tr"><option>DFS</option><option>BFS</option></select></label>
        <button id="graph-run" class="action">Run</button>
        <button id="graph-reset" class="action">Reset</button>
      </div>
      <svg id="graph-svg" viewBox="0 0 800 360" style="width:100%;height:360px;margin-top:10px"></svg>
    `;
    const svg = root.querySelector('#graph-svg');
    const nodes = [{id:0,x:120,y:80},{id:1,x:270,y:40},{id:2,x:420,y:80},{id:3,x:180,y:200},{id:4,x:360,y:220}];
    const edges = [[0,1],[1,2],[0,3],[1,3],[2,4],[3,4]];

    function draw(highlight = []){
      svg.innerHTML = '';
      edges.forEach(e=>{
        const a = nodes[e[0]], b = nodes[e[1]];
        const l = document.createElementNS('http://www.w3.org/2000/svg','line');
        l.setAttribute('x1', a.x); l.setAttribute('y1', a.y); l.setAttribute('x2', b.x); l.setAttribute('y2', b.y); l.setAttribute('stroke','#d0d8e0'); l.setAttribute('stroke-width',2);
        svg.appendChild(l);
      });
      nodes.forEach(n=>{
        const circ = document.createElementNS('http://www.w3.org/2000/svg','circle'); circ.setAttribute('cx', n.x); circ.setAttribute('cy', n.y); circ.setAttribute('r', 22);
        circ.setAttribute('fill', highlight.includes(n.id) ? '#ff8c00' : '#1768c3'); svg.appendChild(circ);
        const t = document.createElementNS('http://www.w3.org/2000/svg','text'); t.setAttribute('x', n.x); t.setAttribute('y', n.y+6); t.setAttribute('text-anchor','middle'); t.setAttribute('fill','#fff'); t.textContent = n.id; svg.appendChild(t);
      });
    }

    function runDFS(start=0){
      const visited = new Set(); const order = [];
      function dfs(u){
        visited.add(u); order.push(u);
        edges.forEach(e=>{
          let v = null;
          if(e[0] === u) v = e[1]; else if(e[1] === u) v = e[0];
          if(v !== null && !visited.has(v)) dfs(v);
        });
      }
      dfs(start); animate(order);
    }

    function runBFS(start=0){
      const visited = new Set([start]); const q=[start]; const order=[start];
      while(q.length){
        const u = q.shift();
        edges.forEach(e=>{
          let v = null;
          if(e[0] === u) v = e[1]; else if(e[1] === u) v = e[0];
          if(v !== null && !visited.has(v)){ visited.add(v); q.push(v); order.push(v); }
        });
      }
      animate(order);
    }

    function animate(order){
      let i = 0; const speed = Math.max(10, 220 - document.getElementById('speed').value);
      (function step(){
        draw(order.slice(0, i+1));
        if(i < order.length){ log('Visited: ' + order[i]); i++; setTimeout(step, speed); } else log('Traversal finished.');
      })();
    }

    document.getElementById('graph-run').onclick = ()=> {
      const t = document.getElementById('graph-tr').value;
      if(t === 'DFS') runDFS(0); else runBFS(0);
    };
    document.getElementById('graph-reset').onclick = ()=> draw();

    function log(t){ const obs = document.getElementById('obs'); if(!obs) return; const d=document.createElement('div'); d.textContent = '• ' + t; obs.prepend(d); if(obs.childElementCount>8) obs.removeChild(obs.lastElementChild); }
    draw();
    window.currentSim = { start: ()=> log('Graph demo: use run'), pause: ()=> {}, reset: ()=> draw() };
  };
})();
