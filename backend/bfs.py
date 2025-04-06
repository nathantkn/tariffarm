import json
from collections import deque
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os  # ✅ Add this line



def bfs_top_routes(graph, start, end, max_routes=3):
    """
    BFS to find up to `max_routes` best paths (by tax + time) from start to end.
    """
    queue = deque([(start, [start], 0, 0)])
    visited_paths = []

    while queue:
        node, path, tax_accum, time_accum = queue.popleft()

        if node == end:
            final_tariff = graph[node]["tariff"]
            total_tax = tax_accum + final_tariff

            visited_paths.append({
                "path": path,
                "total_tax": total_tax,
                "total_time": time_accum
            })
            continue

        for neighbor in graph[node]["neighbors"]:
            next_node = neighbor["country"]
            if next_node not in path:  # prevent cycles
                queue.append((
                    next_node,
                    path + [next_node],
                    tax_accum + neighbor["tax"],
                    time_accum + neighbor["time"]
                ))

    # Sort by total_tax first, then total_time
    visited_paths.sort(key=lambda x: (x["total_tax"], x["total_time"]))
    return visited_paths[:max_routes]


# === INPUT ===
start_country = "India"
end_country = "USA"
transport_mode = "sea"  # Options: "land", "sea", "airplane"

# === LOGIC ===
if transport_mode == "airplane":
    with open("bfs_data/list_airplane.json", "r") as f:
        air_data = json.load(f)

    if start_country in air_data:
        flight_time = air_data[start_country]
        print(f"✈️ Airplane Mode Selected")
        print(f"Route: {start_country} → {end_country}")
        print(f"Total Flight Time (hours): {flight_time}")
    else:
        print("✈️ No direct flight time data available for this route.")
else:
    filename = (
        "bfs_data/adjacency_list_land.json" if transport_mode == "land"
        else "bfs_data/adjacency_list_sea.json"
    )

    with open(filename, "r") as f:
        graph = json.load(f)

    # ✅ Patch to avoid KeyError from missing neighbor nodes
    for country in list(graph.keys()):
        for neighbor in graph[country]["neighbors"]:
            neighbor_name = neighbor["country"]
            if neighbor_name not in graph:
                graph[neighbor_name] = {"neighbors": [], "tariff": 10}

    results = bfs_top_routes(graph, start_country, end_country)

    if results:
        print(f"🚚 Transport Mode: {transport_mode.capitalize()}")
        print(f"🔍 Showing up to {len(results)} best route(s):\n")
        for i, route in enumerate(results, 1):
            print(f"🔸 Route #{i}: {' → '.join(route['path'])}")
            print(f"    Total Tax (%): {route['total_tax']}")
            print(f"    Total Time (days): {route['total_time']}\n")
    else:
        print("⚠️ No valid route found between these countries.")
