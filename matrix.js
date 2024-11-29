var states = {
  reflexive: true,
  antireflexive: true,
  symmetric: true,
  antisymmetric: true,
  transitive: true,
};

var matrix = [];
var columnsIds = [];
var labelNames = [];

function addNewMatrixEntry(id) {
  for (let i = 0; i < matrix.length; i++) matrix[i].values.push(0);

  columnsIds.push(id);

  let newLine = { id: id, values: [0] };

  if (matrix.length > 0) {
    for (let i = 1; i < matrix[0].values.length; i++) newLine.values.push(0);
  }

  matrix.push(newLine);
}

function addNewMatrixEdge(fromId, toId) {
  let yIdx = "";
  let xIdx = "";

  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].id == fromId) {
      yIdx = i;
      break;
    }
  }

  for (let i = 0; i < columnsIds.length; i++) {
    if (matrix[i].id == toId) {
      xIdx = i;
      break;
    }
  }

  matrix[yIdx].values[xIdx] = 1;
}

function toggleMatrixEdge(fromId, toId) {
  let yIdx = "";
  let xIdx = "";

  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].id == fromId) {
      yIdx = i;
      break;
    }
  }

  for (let i = 0; i < columnsIds.length; i++) {
    if (matrix[i].id == toId) {
      xIdx = i;
      break;
    }
  }

  matrix[yIdx].values[xIdx] = !matrix[yIdx].values[xIdx];
}

function calcNewMatrixState() {
  let reflexiveCalc = true;
  let antireflexiveCalc = true;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (i == j && matrix[i].values[j] != 1) {
        reflexiveCalc = false;
      }

      if (i == j && matrix[i].values[j] != 0) {
        antireflexiveCalc = false;
      }
    }
  }

  states.reflexive = reflexiveCalc;
  states.antireflexive = antireflexiveCalc;
}

for (let i = 65; i < 91; i++) labelNames.push(i);
