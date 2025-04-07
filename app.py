
from flask import Flask, render_template, request, jsonify
import heapq

app = Flask(__name__)

def dijkstra(graph, start):
    n = len(graph)
    dist = [float('inf')] * n
    dist[start] = 0
    prev = [None] * n
    pq = [(0, start)]

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                prev[v] = u
                heapq.heappush(pq, (dist[v], v))

    return dist, prev

def reconstruct_path(prev, target):
    path = []
    while target is not None:
        path.append(target)
        target = prev[target]
    return path[::-1]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/dijkstra", methods=["POST"])
def solve_dijkstra():
    data = request.get_json()
    num_nodes = int(data["num_nodes"])
    edges = data["edges"]
    start_node = int(data["start_node"])
    end_node = int(data["end_node"])

    # Build graph as adjacency list
    graph = [[] for _ in range(num_nodes)]
    for edge in edges:
        u, v, w = edge
        graph[u].append((v, w))

    distances, prev = dijkstra(graph, start_node)
    path = reconstruct_path(prev, end_node)

    return jsonify({"distances": distances, "path": path})

if __name__ == "__main__":
    app.run(debug=True)
