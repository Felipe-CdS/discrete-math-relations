var mode = "pan";

var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);

var container = document.getElementById("mynetwork");

var data = {
  nodes: nodes,
  edges: edges,
};

var options = {
  nodes: {
    shape: "dot",
    size: 10,
  },
  physics: {
    enabled: true,
  },
  configure: {
    enabled: false,
  },
  manipulation: {
    enabled: false,
    addEdge: function (edgeData, callback) {
      edgeData.arrows = "to";
      let e = network.body.edges;

      for (let i = 0; i < Object.keys(e).length; i++) {
        let k = Object.keys(e)[i];

        if (e[k].fromId == edgeData.from && e[k].toId == edgeData.to) {
          return;
        }
        if (e[k].fromId == edgeData.to && e[k].toId == edgeData.from) {
          network.updateEdge(k, { arrows: "to, from" });
          break;
        }
      }
      toggleMatrixEdge(edgeData.from, edgeData.to);
      calcNewMatrixState();
      changeMsgSpan("pan");
      updateStatesUI();
      callback(edgeData);
    },
  },
};

var network = new vis.Network(container, data, options);

function newNodeMode() {
  changeMsgSpan("addNode");
}

function addNewEdge() {
  changeMsgSpan("addEdge");
  network.manipulation.addEdgeMode();
}

function deleteOneMode() {
  changeMsgSpan("deleteOne");
}

function deleteAll() {
  nodes = new vis.DataSet([]);
  edges = new vis.DataSet([]);
  labelNames = [];
  for (let i = 65; i < 91; i++) labelNames.push(i);

  network.setData({ nodes, edges });
}

function panMode() {
  changeMsgSpan("pan");
  network.disableEditMode();
}

function changeMsgSpan(newMode) {
  let span = document.getElementById("msg-span");
  document.getElementById("pan-button").classList.remove("selected-button");
  document
    .getElementById("new-node-button")
    .classList.remove("selected-button");
  document
    .getElementById("new-edge-button")
    .classList.remove("selected-button");
  document
    .getElementById("delete-one-button")
    .classList.remove("selected-button");

  switch (newMode) {
    case "pan":
      mode = "pan";
      document.getElementById("pan-button").classList.add("selected-button");
      span.innerHTML = "Clique em qualquer lugar para adicionar um novo nó.";
      break;
    case "addNode":
      mode = "addNode";
      document
        .getElementById("new-node-button")
        .classList.toggle("selected-button");
      span.innerHTML =
        "Clique em qualquer lugar para adicionar um novo vértice.";
      break;
    case "addEdge":
      mode = "addEdge";
      document
        .getElementById("new-edge-button")
        .classList.toggle("selected-button");
      span.innerHTML =
        "Arraste o cursor de um vértice até o outro para criar uma relação.";
      break;

    case "deleteOne":
      mode = "deleteOne";
      document
        .getElementById("delete-one-button")
        .classList.toggle("selected-button");
      span.innerHTML = "Clique em qualquer item para deletar.";
      break;
  }
}

network.on("click", function (e) {
  if (mode == "addNode") {
    let n = network.body.nodes;

    let validPlace = true;
    cursorX = e.pointer.canvas.x;
    cursorY = e.pointer.canvas.y;

    for (let i = 0; i < Object.keys(n).length; i++) {
      let k = Object.keys(n)[i];

      xDis = Math.abs(n[k].x - cursorX);
      yDis = Math.abs(n[k].y - cursorY);

      if (xDis < 10 && yDis < 10) validPlace = false;
    }

    if (validPlace) {
      let id = nodes.add({
        x: cursorX,
        y: cursorY,
        label: String.fromCharCode(labelNames[0]),
        font: { size: 20, color: "white" },
      });
      labelNames.shift();
      addNewMatrixEntry(id[0]);
      calcNewMatrixState();
      updateStatesUI();
    }
  }
});

network.on("select", function () {
  if (mode == "deleteOne") {
    let selection = network.getSelection();

    if (selection.edges.length > 0) {
      let toBeDeleted = network.body.edges[selection.edges[0]];
      toggleMatrixEdge(toBeDeleted.fromId, toBeDeleted.toId);
    } else {
      let toBeDeleted = network.body.nodes[selection.nodes[0]];
      labelNames.push(toBeDeleted.options.label.charCodeAt(0));
      labelNames.sort();
    }

    network.deleteSelected();
    calcNewMatrixState();
    updateStatesUI();
  }
});

function updateStatesUI() {
  console.log(states);
  if (states.reflexive) {
    document.getElementById("reflexive-ui").classList.add("true-property");
  } else {
    document.getElementById("reflexive-ui").classList.remove("true-property");
  }

  if (states.antireflexive) {
    console.log("~!!!!");
    document.getElementById("antireflexive-ui").classList.add("true-property");
  } else {
    document
      .getElementById("antireflexive-ui")
      .classList.remove("true-property");
  }
}
