(function () {
  window.initLinkedlist = function (root) {
    root.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <label style="font-size:13px;">Value:
          <input id="ll-val" value="7" style="width:80px;">
        </label>
        <button id="ll-head" class="btn">Insert head</button>
        <button id="ll-tail" class="btn">Insert tail</button>
        <button id="ll-del" class="btn">Delete value</button>
        <button id="ll-clear" class="btn">Clear</button>
      </div>
      <svg id="ll-svg" viewBox="0 0 900 180" style="width:100%;height:180px;margin-top:10px;"></svg>
    `;
    const svg = root.querySelector("#ll-svg");
    let nodes = [];

    function draw() {
      svg.innerHTML = "";
      const y = 70;
      const w = 80;
      const h = 40;
      const startX = 30;
      nodes.forEach((val, i) => {
        const x = startX + i * (w + 40);
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", w);
        rect.setAttribute("height", h);
        rect.setAttribute("rx", 8);
        rect.setAttribute("fill", "#e8fff3");
        rect.setAttribute("stroke", "#0b8a4a");
        svg.appendChild(rect);

        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", x + w / 2);
        text.setAttribute("y", y + h / 2 + 4);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#064726");
        text.textContent = val;
        svg.appendChild(text);

        if (i < nodes.length - 1) {
          const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );
          line.setAttribute("x1", x + w);
          line.setAttribute("y1", y + h / 2);
          line.setAttribute("x2", x + w + 24);
          line.setAttribute("y2", y + h / 2);
          line.setAttribute("stroke", "#333");
          line.setAttribute("stroke-width", 2);
          svg.appendChild(line);
        }
      });
    }

    function log(msg) {
      const obs = document.getElementById("obs");
      if (!obs) return;
      const d = document.createElement("div");
      d.textContent = "• " + msg;
      obs.prepend(d);
      while (obs.childElementCount > 8) obs.removeChild(obs.lastElementChild);
    }

    function insertHead() {
      const v = root.querySelector("#ll-val").value;
      nodes.unshift(v);
      draw();
      log("Inserted " + v + " at head.");
    }
    function insertTail() {
      const v = root.querySelector("#ll-val").value;
      nodes.push(v);
      draw();
      log("Inserted " + v + " at tail.");
    }
    function deleteVal() {
      const v = root.querySelector("#ll-val").value;
      const idx = nodes.indexOf(v);
      if (idx === -1) {
        log("Value not found.");
        return;
      }
      nodes.splice(idx, 1);
      draw();
      log("Deleted " + v);
    }
    function clearAll() {
      nodes = [];
      draw();
      log("List cleared.");
    }

    root.querySelector("#ll-head").addEventListener("click", insertHead);
    root.querySelector("#ll-tail").addEventListener("click", insertTail);
    root.querySelector("#ll-del").addEventListener("click", deleteVal);
    root.querySelector("#ll-clear").addEventListener("click", clearAll);

    window.currentSim = {
      start: () => log("Use Insert / Delete buttons."),
      pause: () => {},
      reset: clearAll,
    };
    draw();
  };
})();
