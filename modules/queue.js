(function () {
  window.initQueue = function (root) {
    root.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <label style="font-size:13px;">Value:
          <input id="q-val" value="5" style="width:80px;">
        </label>
        <button id="q-enq" class="btn">Enqueue</button>
        <button id="q-deq" class="btn">Dequeue</button>
        <button id="q-clear" class="btn">Clear</button>
      </div>
      <svg id="q-svg" viewBox="0 0 600 180" style="width:100%;height:180px;margin-top:10px;"></svg>
    `;
    const svg = root.querySelector("#q-svg");
    let q = [];

    function draw() {
      svg.innerHTML = "";
      const y = 70;
      const w = 80;
      const h = 45;
      const startX = 40;
      q.forEach((val, i) => {
        const x = startX + i * (w + 12);
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", w);
        rect.setAttribute("height", h);
        rect.setAttribute("rx", 8);
        rect.setAttribute("fill", "#fff7e8");
        rect.setAttribute("stroke", "#ff8c00");
        svg.appendChild(rect);

        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", x + w / 2);
        text.setAttribute("y", y + h / 2 + 4);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#5a3a00");
        text.textContent = val;
        svg.appendChild(text);
      });

      if (q.length) {
        const front = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        front.setAttribute("x", startX);
        front.setAttribute("y", y - 15);
        front.setAttribute("fill", "#333");
        front.textContent = "Front";
        svg.appendChild(front);

        const rear = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        rear.setAttribute("x", startX + (q.length - 1) * (w + 12) + w);
        rear.setAttribute("y", y - 15);
        rear.setAttribute("fill", "#333");
        rear.textContent = "Rear";
        svg.appendChild(rear);
      }
    }

    function log(msg) {
      const obs = document.getElementById("obs");
      if (!obs) return;
      const d = document.createElement("div");
      d.textContent = "• " + msg;
      obs.prepend(d);
      while (obs.childElementCount > 8) obs.removeChild(obs.lastElementChild);
    }

    function enq() {
      const v = root.querySelector("#q-val").value;
      q.push(v);
      draw();
      log("Enqueued " + v);
    }
    function deq() {
      if (!q.length) {
        log("Queue underflow.");
        return;
      }
      const v = q.shift();
      draw();
      log("Dequeued " + v);
    }
    function clearAll() {
      q = [];
      draw();
      log("Queue cleared.");
    }

    root.querySelector("#q-enq").addEventListener("click", enq);
    root.querySelector("#q-deq").addEventListener("click", deq);
    root.querySelector("#q-clear").addEventListener("click", clearAll);

    window.currentSim = {
      start: () => log("Use Enqueue and Dequeue."),
      pause: () => {},
      reset: clearAll,
    };
    draw();
  };
})();
