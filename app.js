// app.js – controls simulation.html

const MODULES = {
  sorting: {
    name: "Sorting Visualizer",
    aim: "Visualize Bubble, Merge and Quick sort step by step.",
    theory:
      "Sorting arranges data in ascending or descending order. We demonstrate comparison-based sorts and show intermediate states.",
    procedure:
      "Enter an array, select algorithm, click Load then Start. Observe swaps and final order.",
    pretest: [
      {
        q: "Which algorithm is divide-and-conquer?",
        opts: ["Bubble sort", "Merge sort", "Selection sort"],
        a: 1,
      },
    ],
  },
  stack: {
    name: "Stack Operations (LIFO)",
    aim: "Show push, pop and the TOP pointer.",
    theory:
      "A stack follows Last-In-First-Out (LIFO). It supports push, pop and peek operations.",
    procedure: "Enter value, click Push / Pop. Observe changes in the stack.",
    pretest: [
      {
        q: "Stack follows which discipline?",
        opts: ["FIFO", "LIFO"],
        a: 1,
      },
    ],
  },
  queue: {
    name: "Queue Operations (FIFO)",
    aim: "Show enqueue and dequeue with front and rear.",
    theory:
      "A queue follows First-In-First-Out (FIFO). Enqueue adds at the rear; dequeue removes from the front.",
    procedure: "Enter value, click Enqueue / Dequeue.",
    pretest: [
      {
        q: "Which structure is best for BFS?",
        opts: ["Stack", "Queue"],
        a: 1,
      },
    ],
  },
  linkedlist: {
    name: "Linked List Simulation",
    aim: "Visualize node insertion and deletion.",
    theory:
      "A linked list consists of nodes that store data and a pointer to the next node.",
    procedure: "Insert at head/tail or delete by value using controls.",
    pretest: [
      {
        q: "Each node of singly linked list stores:",
        opts: ["Data only", "Data & next pointer", "Index"],
        a: 1,
      },
    ],
  },
  bst: {
    name: "Binary Search Tree",
    aim: "Visualize insertion, search and deletion in BST.",
    theory:
      "BST maintains the property: left subtree < node < right subtree. Searching is O(h).",
    procedure: "Insert numeric values, search and delete using buttons.",
    pretest: [
      {
        q: "In BST, left child is:",
        opts: ["Greater than node", "Less than node", "Unrelated"],
        a: 1,
      },
    ],
  },
  tree: {
    name: "Tree Traversals",
    aim: "Show DFS (preorder) and BFS traversal orders.",
    theory:
      "Tree traversal visits every node exactly once in a specific order.",
    procedure: "Click DFS or BFS button to see traversal animation.",
    pretest: [
      {
        q: "BFS typically uses:",
        opts: ["Stack", "Queue"],
        a: 1,
      },
    ],
  },
  graph: {
    name: "Graph Traversal",
    aim: "Visualize DFS and BFS on a simple graph.",
    theory:
      "Graphs consist of vertices and edges. DFS explores depth-wise, BFS explores level-wise.",
    procedure: "Select DFS/BFS and click Run.",
    pretest: [
      {
        q: "Which is better for shortest path in unweighted graph?",
        opts: ["DFS", "BFS"],
        a: 1,
      },
    ],
  },
};

const sections = [
  "Aim",
  "Theory",
  "Procedure",
  "Demo",
  "Practice",
  "Pretest",
  "Posttest",
  "References",
];

function getMod() {
  const url = new URL(window.location.href);
  return url.searchParams.get("mod");
}

let currentMeta = null;
let activeSection = "Aim";
window.currentSim = null; // modules attach controls

function initSimulationPage() {
  const mod = getMod();
  if (!mod || !MODULES[mod]) {
    document.getElementById("exp-name").textContent = "Experiment not found";
    document.getElementById("content-area").textContent =
      "Invalid or missing module id in URL.";
    return;
  }

  currentMeta = MODULES[mod];

  document.getElementById("exp-name").textContent = currentMeta.name;
  document.getElementById("module-subtitle").textContent =
    "Module: " + mod.toUpperCase();

  const tabBar = document.getElementById("tab-bar");
  tabBar.innerHTML = "";
  sections.forEach((name) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.textContent = name;
    btn.dataset.section = name;
    btn.addEventListener("click", () => {
      activeSection = name;
      renderSection();
    });
    tabBar.appendChild(btn);
  });

  loadModuleScript(mod).then(() => {
    activeSection = "Aim";
    renderSection();
  });
}

function renderSection() {
  const area = document.getElementById("content-area");
  // update active tab
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.section === activeSection);
  });

  if (!currentMeta) {
    area.textContent = "No module meta available.";
    return;
  }

  if (activeSection === "Aim") {
    area.innerHTML = `
      <h3>Aim</h3>
      <p>${currentMeta.aim}</p>
    `;
  } else if (activeSection === "Theory") {
    area.innerHTML = `
      <h3>Theory</h3>
      <p>${currentMeta.theory}</p>
    `;
  } else if (activeSection === "Procedure") {
    area.innerHTML = `
      <h3>Procedure</h3>
      <p>${currentMeta.procedure}</p>
    `;
  } else if (activeSection === "Demo") {
    area.innerHTML = `
      <h3>Demo</h3>
      <div class="badge">Use controls to run the simulation</div>
      <div id="sim-root" class="visual" style="margin-top:10px"></div>
      <div class="controls">
        <button id="start-btn" class="btn primary">Start</button>
        <button id="pause-btn" class="btn">Pause</button>
        <button id="reset-btn" class="btn">Reset</button>
        <label style="font-size:12px;">
          Speed:
          <input type="range" id="speed" min="1" max="200" value="90" />
        </label>
      </div>
      <div id="obs" class="obs">Observations will appear here…</div>
    `;

    // wire generic buttons to currentSim
    setTimeout(() => {
      document
        .getElementById("start-btn")
        .addEventListener("click", () => window.currentSim?.start?.());
      document
        .getElementById("pause-btn")
        .addEventListener("click", () => window.currentSim?.pause?.());
      document
        .getElementById("reset-btn")
        .addEventListener("click", () => window.currentSim?.reset?.());

      const mod = getMod();
      const fnName =
        "init" + mod.charAt(0).toUpperCase() + mod.slice(1); // e.g. initSorting
      if (typeof window[fnName] === "function") {
        window[fnName](document.getElementById("sim-root"));
      }
    }, 50);
  } else if (activeSection === "Practice") {
    area.innerHTML = `
      <h3>Practice</h3>
      <p>Run the Demo with different inputs and record your own observations below.</p>
      <div class="obs" contenteditable="true">
        Type your observations here...
      </div>
    `;
  } else if (activeSection === "Pretest" || activeSection === "Posttest") {
    area.innerHTML = buildTestHTML(currentMeta.pretest || [], activeSection);
    setTimeout(wireTestHandlers, 20);
  } else if (activeSection === "References") {
    area.innerHTML = `
      <h3>References</h3>
      <ul>
        <li>CLRS: Introduction to Algorithms</li>
        <li>GeeksforGeeks: Data Structures</li>
        <li>Virtual Labs: vlab.co.in</li>
      </ul>
    `;
  }
}

function buildTestHTML(questions, title) {
  if (!questions.length)
    return `<h3>${title}</h3><p>No quiz configured for this module.</p>`;
  let html = `<h3>${title}</h3><form id="quiz">`;
  questions.forEach((q, i) => {
    html += `<p><strong>${i + 1}. ${q.q}</strong></p>`;
    q.opts.forEach((opt, j) => {
      html += `<label style="display:block;font-size:13px;margin-left:10px;">
        <input type="radio" name="q${i}" value="${j}" /> ${opt}
      </label>`;
    });
  });
  html += `
    <div class="controls" style="margin-top:6px;">
      <button class="btn primary" id="submit-quiz">Submit</button>
      <button class="btn" id="reset-quiz">Reset</button>
    </div>
    <div id="quiz-result" class="obs" style="margin-top:8px;"></div>
  </form>`;
  return html;
}

function wireTestHandlers() {
  const form = document.getElementById("quiz");
  if (!form || !currentMeta?.pretest) return;
  document
    .getElementById("submit-quiz")
    .addEventListener("click", (e) => {
      e.preventDefault();
      let score = 0;
      currentMeta.pretest.forEach((q, i) => {
        const marked = form["q" + i].value;
        if (Number(marked) === q.a) score++;
      });
      const result = document.getElementById("quiz-result");
      result.textContent = `Score: ${score} / ${currentMeta.pretest.length}`;
    });

  document
    .getElementById("reset-quiz")
    .addEventListener("click", (e) => {
      e.preventDefault();
      form.reset();
      document.getElementById("quiz-result").textContent = "";
    });
}

function loadModuleScript(mod) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-mod="${mod}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `modules/${mod}.js`;
    script.dataset.mod = mod;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load module script"));
    document.body.appendChild(script);
  });
}

// initialize when on simulation page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tab-bar")) {
    initSimulationPage();
  }
});
