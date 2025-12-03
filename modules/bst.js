// modules/bst.js
(function(){
  window.initBst = window.initBST = function(root){
    root.innerHTML = `
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <label>Value: <input id="bst-val" value="50" /></label>
        <button id="bst-ins" class="action">Insert</button>
        <button id="bst-search" class="action">Search</button>
        <button id="bst-del" class="action">Delete</button>
        <button id="bst-clear" class="action">Clear</button>
      </div>
      <svg id="bst-svg" viewBox="0 0 1000 360" style="width:100%;height:360px;margin-top:10px"></svg>
    `;
    const svg = root.querySelector('#bst-svg');

    function Node(v){ this.v = v; this.left = null; this.right = null; this.x = 0; this.y = 0; }
    let rootNode = null;

    function insertVal(v){
      if(rootNode === null) { rootNode = new Node(v); log('Inserted root ' + v); draw(); return; }
      let cur = rootNode;
      while(true){
        if(v === cur.v) { log('Value exists'); return; }
        if(v < cur.v){
          if(!cur.left) { cur.left = new Node(v); log('Inserted ' + v); break; } else cur = cur.left;
        } else {
          if(!cur.right) { cur.right = new Node(v); log('Inserted ' + v); break; } else cur = cur.right;
        }
      }
      draw();
    }

    function searchVal(v){
      let cur = rootNode;
      while(cur){
        if(v === cur.v) { log('Found ' + v); pulse(v); return true; }
        cur = v < cur.v ? cur.left : cur.right;
      }
      log('Not found ' + v); return false;
    }

    function deleteVal(v){
      function del(node, val){
        if(!node) return null;
        if(val < node.v) node.left = del(node.left, val);
        else if(val > node.v) node.right = del(node.right, val);
        else {
          if(!node.left) return node.right;
          if(!node.right) return node.left;
          let succ = node.right; while(succ.left) succ = succ.left;
          node.v = succ.v;
          node.right = del(node.right, succ.v);
        }
        return node;
      }
      rootNode = del(rootNode, v);
      draw(); log('Delete attempted for ' + v);
    }

    function clearAll(){ rootNode = null; draw(); log('Cleared BST'); }

    function layout(n, x, y, spread){
      if(!n) return;
      n.x = x; n.y = y;
      layout(n.left, x - spread, y + 80, Math.max(20, spread/1.6));
      layout(n.right, x + spread, y + 80, Math.max(20, spread/1.6));
    }

    function draw(){
      svg.innerHTML = '';
      if(!rootNode) return;
      layout(rootNode, 500, 40, 220);
      (function drawEdges(n){
        if(!n) return;
        if(n.left){
          const l = document.createElementNS('http://www.w3.org/2000/svg','line');
          l.setAttribute('x1', n.x); l.setAttribute('y1', n.y+18); l.setAttribute('x2', n.left.x); l.setAttribute('y2', n.left.y-6); l.setAttribute('stroke','#9aa'); l.setAttribute('stroke-width',2);
          svg.appendChild(l);
          drawEdges(n.left);
        }
        if(n.right){
          const r = document.createElementNS('http://www.w3.org/2000/svg','line');
          r.setAttribute('x1', n.x); r.setAttribute('y1', n.y+18); r.setAttribute('x2', n.right.x); r.setAttribute('y2', n.right.y-6); r.setAttribute('stroke','#9aa'); r.setAttribute('stroke-width',2);
          svg.appendChild(r);
          drawEdges(n.right);
        }
      })(rootNode);
      (function drawNodes(n){
        if(!n) return;
        const circ = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circ.setAttribute('cx', n.x); circ.setAttribute('cy', n.y); circ.setAttribute('r', 18); circ.setAttribute('fill', '#1768c3'); circ.setAttribute('stroke', '#083b6a');
        svg.appendChild(circ);
        const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
        txt.setAttribute('x', n.x); txt.setAttribute('y', n.y+5); txt.setAttribute('text-anchor','middle'); txt.setAttribute('fill','#fff'); txt.style.fontSize='13px'; txt.textContent = n.v;
        svg.appendChild(txt);
        drawNodes(n.left); drawNodes(n.right);
      })(rootNode);
    }

    function pulse(v){
      // simple highlight by re-drawing an overlay
      layout(rootNode, 500, 40, 220);
      const nodes = [];
      (function collect(n){ if(!n) return; nodes.push(n); collect(n.left); collect(n.right);} )(rootNode);
      const target = nodes.find(n=>n.v === v);
      if(!target) return;
      const circ = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circ.setAttribute('cx', target.x); circ.setAttribute('cy', target.y); circ.setAttribute('r', 26); circ.setAttribute('fill', '#ff8c00'); circ.setAttribute('opacity', 0.85);
      svg.appendChild(circ);
      setTimeout(()=> draw(), 700);
    }

    function log(t){ const obs = document.getElementById('obs'); if(!obs) return; const d=document.createElement('div'); d.textContent = '• ' + t; obs.prepend(d); if(obs.childElementCount>8) obs.removeChild(obs.lastElementChild); }

    root.querySelector('#bst-ins').onclick = ()=> insertVal(Number(root.querySelector('#bst-val').value));
    root.querySelector('#bst-search').onclick = ()=> searchVal(Number(root.querySelector('#bst-val').value));
    root.querySelector('#bst-del').onclick = ()=> deleteVal(Number(root.querySelector('#bst-val').value));
    root.querySelector('#bst-clear').onclick = clearAll;

    window.currentSim = { start: ()=> log('BST manual controls'), pause: ()=>{}, reset: ()=> { rootNode = null; draw(); log('Reset'); } };
    draw();
  };
})();
