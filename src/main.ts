import "./style.css";

import output from "./raw";

import { Project, TypeFormatFlags } from "ts-morph";

const plays: Array<[number, number]> = [];
const app = document.getElementById("app")!;
const settings = {
  rows: 5,
  columns: 3,
  mines: 4,
  seed: 1,
};

function addPlay(x: number, y: number) {
  const found = plays.some(([x2, y2]) => x2 === x && y2 === y);
  if (found) {
    return;
  }
  plays.push([x, y]);
  start(app);
}

function getSettings() {
  return `type Settings = {
    rows: ${settings.rows};
    columns: ${settings.columns};
    mines: ${settings.mines};
    seed: ${settings.seed};
  };`;
}
function getPlays() {
  let board = "MakeBoard";
  plays.forEach((x) => {
    board = `
      OpenCell<${board}, ${x[0]}, ${x[1]}>
    `;
  });

  return `${board}`;
}

const project = new Project({ useInMemoryFileSystem: true });
const sourceFile = project.createSourceFile(
  "files.ts",
  `${output} ${getSettings()} 
  type State = MakeBoard;
  type Dislay = DrawBoard<State>;
  const d: Dislay;`
);

function run() {
  const state = sourceFile.getTypeAlias("State");
  state?.setType(getPlays());

  const varDec = sourceFile.getVariableDeclarationOrThrow("d");
  const n = varDec
    .getType()
    .getText(undefined, TypeFormatFlags.InTypeAlias)
    .split('"');

  const filtered = n.filter((_, index) => index % 2 !== 0);

  return filtered;
}

function start(app: HTMLElement) {
  app.innerHTML = "";
  const result = run();
  result.forEach((a, i1) => {
    const div = document.createElement("div");
    a.split("").forEach((x, i2) => {
      const button = document.createElement("button");
      button.classList.add("cellButton");
      switch (x) {
        case "1":
          button.setAttribute("data-state", "1");
          break;
        case "2":
          button.setAttribute("data-state", "2");
          break;
        case "3":
          button.setAttribute("data-state", "3");
          break;
        case "4":
          button.setAttribute("data-state", "4");
          break;
        case "5":
          button.setAttribute("data-state", "5");
          break;
        case "6":
          button.setAttribute("data-state", "6");
          break;
        case "7":
          button.setAttribute("data-state", "7");
          break;
        case "8":
          button.setAttribute("data-state", "8");
          break;
        case "C":
          button.setAttribute("data-state", "hidden");
          break;
        case "O":
          button.setAttribute("data-state", "open");
          break;
        case "M":
          button.setAttribute("data-state", "mine");
          break;
      }
      button.addEventListener("click", () => {
        addPlay(i1, i2);
      });
      div.appendChild(button);
    });
    app.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  start(app);
  document.getElementById("newGame")?.addEventListener("click", () => {});
});
