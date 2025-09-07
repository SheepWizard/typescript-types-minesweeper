import "./style.css";

import output from "./raw";

import { Project, TypeFormatFlags } from "ts-morph";

const plays: Array<[number, number, boolean]> = [];
const app = document.getElementById("app")!;

function getSeed() {
  return Math.floor(Math.random() * 30);
}

const settings = {
  rows: 9,
  columns: 9,
  mines: 10,
  seed: getSeed(),
};

function addPlay(x: number, y: number, flag: boolean) {
  const found = plays.some(([x2, y2, flag]) => x2 === x && y2 === y && !flag);
  if (found) {
    return;
  }
  plays.push([x, y, flag]);
  start();
}

function getSettings() {
  return `{
    rows: ${settings.rows};
    columns: ${settings.columns};
    mines: ${settings.mines};
    seed: ${settings.seed};
  }`;
}
function getPlays() {
  let board = "MakeBoard";
  plays.forEach((x) => {
    if (x[2]) {
      board = `
        FlagCell<${board}, ${x[0]}, ${x[1]}>
      `;
    } else {
      board = `
        OpenCell<${board}, ${x[0]}, ${x[1]}>
      `;
    }
  });

  return `${board}`;
}

const project = new Project({ useInMemoryFileSystem: true });
const sourceFile = project.createSourceFile(
  "files.ts",
  `${output} 
  type Settings = ${getSettings()};
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

function start() {
  app.innerHTML = "";
  const result = run();
  result.forEach((a, i1) => {
    const div = document.createElement("div");
    div.classList.add("cellRow");
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
        case "F":
          button.setAttribute("data-state", "flag");
          break;
      }
      button.addEventListener("click", () => {
        addPlay(i1, i2, false);
      });
      button.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        addPlay(i1, i2, true);
      });
      div.appendChild(button);
    });
    app.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  start();
  document.getElementById("newGame")?.addEventListener("click", () => {
    settings.seed = getSeed();
    const settingsType = sourceFile.getTypeAlias("Settings");
    settingsType?.setType(getSettings());
    plays.splice(0, plays.length);
    start();
  });
});
