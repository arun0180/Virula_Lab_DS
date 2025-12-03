(function () {
  function drawArray(canvas, arr, highlight = []) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!arr.length) return;
    const n = arr.length;
    const barW = Math.max(8, Math.floor(w / n) - 6);
    const max = Math.max(...arr);
    arr.forEach((v, i) => {
      const x = i * (barW + 6) + 8;
      const barH = Math.round((v / max) * (h - 30));
      ctx.fillStyle = highlight.includes(i) ? "#ff8c00" : "#1b63d8";
      ctx.fillRect(x, h - 8 - barH, barW, barH);
      ctx.fillStyle = "#fff";
      ctx.font = "11px sans-serif";
      ctx.fillText(String(v), x + barW / 2 - 6, h - 10);
    });
  }

  function stepsForAlgo(arr, algo) {
    const steps = [];
    const record = (a, hl) => steps.push({ arr: a.slice(), hl: hl || [] });

    if (algo === "Bubble") {
      const A = arr.slice();
      for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A.length - i - 1; j++) {
          record(A, [j, j + 1]);
          if (A[j] > A[j + 1]) {
            [A[j], A[j + 1]] = [A[j + 1], A[j]];
            record(A, [j, j + 1]);
          }
        }
      }
    } else if (algo === "Merge") {
      const A = arr.slice();
      function merge(l, m, r) {
        const L = A.slice(l, m + 1);
        const R = A.slice(m + 1, r + 1);
        let i = 0,
          j = 0,
          k = l;
        while (i < L.length && j < R.length)
          A[k++] = L[i] <= R[j] ? L[i++] : R[j++];
        while (i < L.length) A[k++] = L[i++];
        while (j < R.length) A[k++] = R[j++];
        record(A, []);
      }
      function ms(l, r) {
        if (l >= r) return;
        const m = ((l + r) / 2) | 0;
        ms(l, m);
        ms(m + 1, r);
        merge(l, m, r);
      }
      ms(0, A.length - 1);
      record(A, []);
    } else {
      // Quick
      const A = arr.slice();
      function qs(l, r) {
        if (l >= r) return;
        const pivot = A[r];
        let i = l;
        for (let j = l; j < r; j++) {
          record(A, [j, r]);
          if (A[j] < pivot) {
            [A[i], A[j]] = [A[j], A[i]];
            record(A, [i, j]);
            i++;
          }
        }
        [A[i], A[r]] = [A[r], A[i]];
        record(A, [i, r]);
        qs(l, i - 1);
        qs(i + 1, r);
      }
      qs(0, A.length - 1);
      record(A, []);
    }

    return steps;
  }

  window.initSorting = function (root) {
    root.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <label style="font-size:13px;">Array:
          <input id="sort-arr" value="50,20,90,10,40,70" style="min-width:210px;">
        </label>
        <label style="font-size:13px;">Algo:
          <select id="sort-algo">
            <option>Bubble</option>
            <option>Merge</option>
            <option>Quick</option>
          </select>
        </label>
        <button id="sort-load" class="btn">Load</button>
      </div>
      <canvas id="sort-canvas" style="width:100%;height:230px;margin-top:10px;border-radius:10px;"></canvas>
    `;
    const canvas = root.querySelector("#sort-canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = 220;
    let arr = [];
    let steps = [];
    let idx = 0;
    let timer = null;

    function log(msg) {
      const obs = document.getElementById("obs");
      if (!obs) return;
      const div = document.createElement("div");
      div.textContent = "• " + msg;
      obs.prepend(div);
      while (obs.childElementCount > 8) obs.removeChild(obs.lastElementChild);
    }

    function load() {
      const val = root.querySelector("#sort-arr").value;
      arr = val
        .split(",")
        .map((x) => parseInt(x.trim(), 10))
        .filter((x) => !Number.isNaN(x));
      const algo = root.querySelector("#sort-algo").value;
      steps = stepsForAlgo(arr, algo);
      idx = 0;
      drawArray(canvas, arr);
      log(`Loaded array [${arr.join(", ")}] using ${algo} sort.`);
    }

    function play() {
      if (!steps.length) {
        log("Load array first.");
        return;
      }
      if (timer) return;
      const speedSlider = document.getElementById("speed");
      const delay = speedSlider ? Math.max(10, 210 - speedSlider.value) : 80;
      (function step() {
        if (idx >= steps.length) {
          clearTimeout(timer);
          timer = null;
          log("Sorting complete.");
          return;
        }
        const st = steps[idx++];
        drawArray(canvas, st.arr, st.hl);
        timer = setTimeout(step, delay);
      })();
    }

    function pause() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
        log("Paused.");
      }
    }

    function reset() {
      pause();
      idx = 0;
      drawArray(canvas, arr);
      log("Reset.");
    }

    root.querySelector("#sort-load").addEventListener("click", load);
    window.currentSim = { start: play, pause, reset };
    load();
  };
})();
