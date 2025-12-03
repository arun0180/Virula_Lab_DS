(function () {
  window.initStack = function (root) {
    root.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <label style="font-size:13px;">Value:
          <input id="stack-val" value="10" style="width:80px;">
        </label>
        <button id="stack-push" class="btn">Push</button>
        <button id="stack-pop" class="btn">Pop</button>
        <button id="stack-clear" class="btn">Clear</button>
      </div>
      <svg id="stack-svg" viewBox="0 0 400 260" style="width:100%;height:230px;margin-top:10px;"></svg>
    `;
    const svg = root.querySelector("#stack-svg");
    let stack = [];

    function draw() {
      svg.innerHTML = "";
      const baseX = 150;
      const baseY = 220;
      const w = 100;
      const h = 40;
      stack.forEach((val, i) => {
        const y = baseY - (i + 1) * (h + 8);
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", baseX);
        rect.setAttribute("y", y);
        rect.setAttribute("width", w);
        rect.setAttribute("height", h);
        rect.setAttribute("rx", 8);
        rect.setAttribute("fill", "#e3f0ff");
        rect.setAttribute("stroke", "#1b63d8");
        svg.appendChild(rect);

        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", baseX + w / 2);
        text.setAttribute("y", y + h / 2 + 4);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#123");
        text.textContent = val;
        svg.appendChild(text);
      });

      if (stack.length) {
        const topText = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        topText.setAttribute("x", baseX + w + 18);
        topText.setAttribute(
          "y",
          baseY - stack.length * (h + 8) + h / 2 + 4
        );
        topText.setAttribute("fill", "#ff8c00");
        topText.textContent = "TOP";
        svg.appendChild(topText);
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

    function pushVal() {
      const v = root.querySelector("#stack-val").value;
      stack.push(v);
      draw();
      log("Pushed " + v);
    }
    function popVal() {
      if (!stack.length) {
        log("Stack underflow.");
        return;
      }
      const v = stack.pop();
      draw();
      log("Popped " + v);
    }
    function clearAll() {
      stack = [];
      draw();
      log("Stack cleared.");
    }

    root.querySelector("#stack-push").addEventListener("click", pushVal);
    root.querySelector("#stack-pop").addEventListener("click", popVal);
    root.querySelector("#stack-clear").addEventListener("click", clearAll);

    window.currentSim = {
      start: () => log("Use Push and Pop buttons."),
      pause: () => {},
      reset: clearAll,
    };
    draw();
  };
})();
