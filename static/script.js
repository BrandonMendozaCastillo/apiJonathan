
document.getElementById("dijkstraForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const num_nodes = parseInt(document.getElementById("num_nodes").value);
  const start_node = parseInt(document.getElementById("start_node").value);
  const end_node = parseInt(document.getElementById("end_node").value);
  const edgeLines = document.getElementById("edges").value.trim().split("\n");

  const edges = edgeLines.map(line => {
    const [from, to, weight] = line.split(",").map(Number);
    return [from, to, weight];
  });

  const response = await fetch("/dijkstra", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ num_nodes, edges, start_node, end_node })
  });

  const result = await response.json();
  const { distances, path } = result;

  document.getElementById("result").innerText =
    "Distancias: " + JSON.stringify(distances, null, 2) +
    "\nRuta más corta hasta nodo destino: " + path.join(" -> ");

  // Visualize with vis-network
  const nodes = Array.from({ length: num_nodes }, (_, i) => ({
    id: i, label: `Nodo ${i}`
  }));

  const edgeList = edges.map(([from, to, weight]) => {
    const isPath = path.includes(from) && path.includes(to) && Math.abs(path.indexOf(from) - path.indexOf(to)) === 1;
    return {
      from, to,
      label: `${weight}`,
      arrows: "to",
      color: isPath ? { color: "red" } : undefined
    };
  });

  const container = document.getElementById("network");
  const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edgeList) };
  const options = { physics: { enabled: true }, edges: { font: { align: "top" } } };

  new vis.Network(container, data, options);
});
