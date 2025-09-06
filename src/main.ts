import "./style.css";

import output from "./stuff";

import { Project, TypeFormatFlags } from "ts-morph";

const plays: Array<[number, number]> = [];

function settings() {
  return `type Settings = {
  rows: 8;
  columns: 8;
  mines: 5;
  seed: 6;
};`;
}
function getPlays() {
  let board = "MakeBoard";
  plays.forEach((x) => {
    board = `
      OpenCell<${board}, ${x[0]}, ${x[1]}>
    `;
  });

  return `type State = ${board}`;
}

function run() {
  const project = new Project({ useInMemoryFileSystem: true });
  console.log(getPlays());
  const sourceFile = project.createSourceFile(
    "files.ts",
    `${output} ${settings()} 
    ${getPlays()}
    type Dislay = DrawBoard<State>;

    const d: Dislay;`
  );
  sourceFile.saveSync();

  const varDec = sourceFile.getVariableDeclarationOrThrow("d");

  const n = varDec
    .getType()
    .getText(undefined, TypeFormatFlags.InTypeAlias)
    .split('"');

  const b = n.filter((_, index) => index % 2 !== 0);

  return b;
}

function start(app: HTMLElement) {
  app.innerHTML = "";
  const b = run();
  console.log(b);
  b.forEach((a, i1) => {
    const div = document.createElement("div");
    a.split("").forEach((x, i2) => {
      const button = document.createElement("button");
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
        plays.push([i1, i2]);
        start(app);
      });
      div.appendChild(button);
    });
    app.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app")!;
  start(app);
});
