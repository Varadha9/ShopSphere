// ╔══════════════════════════════════════════════════════════════════╗
// ║  DSA: Graph (Adjacency List)  →  Map<String, List<Edge>>         ║
// ║  Each city maps to a list of {to, dist} edges.                   ║
// ║  Fed into Dijkstra's algorithm in useStore.jsx.                  ║
// ╚══════════════════════════════════════════════════════════════════╝
export const DELIVERY_GRAPH = {
  Mumbai:     [{ to: "Pune", dist: 148 }, { to: "Nashik", dist: 166 }],
  Pune:       [{ to: "Mumbai", dist: 148 }, { to: "Nashik", dist: 213 }, { to: "Hyderabad", dist: 560 }],
  Nashik:     [{ to: "Mumbai", dist: 166 }, { to: "Pune", dist: 213 }, { to: "Aurangabad", dist: 100 }],
  Aurangabad: [{ to: "Nashik", dist: 100 }, { to: "Hyderabad", dist: 488 }],
  Hyderabad:  [{ to: "Pune", dist: 560 }, { to: "Aurangabad", dist: 488 }, { to: "Bangalore", dist: 570 }],
  Bangalore:  [{ to: "Hyderabad", dist: 570 }, { to: "Chennai", dist: 346 }],
  Chennai:    [{ to: "Bangalore", dist: 346 }],
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  DSA: Graph (Adjacency List)  →  Map<Book, Set<Book>>            ║
// ║  Co-purchase edges. BFS in useStore.jsx walks this graph.        ║
// ║  Visited set prevents cycles. O(V+E) traversal.                  ║
// ╚══════════════════════════════════════════════════════════════════╝
export const RECOMMENDATION_GRAPH = {
  p1:  ["p2", "p7", "p12"],
  p2:  ["p1", "p7", "p12"],
  p3:  ["p4", "p8", "p11"],
  p4:  ["p3", "p8", "p11"],
  p5:  ["p9", "p6"],
  p6:  ["p10", "p5"],
  p7:  ["p1", "p2", "p12"],
  p8:  ["p3", "p4"],
  p9:  ["p5", "p6"],
  p10: ["p6", "p5"],
  p11: ["p3", "p4"],
  p12: ["p1", "p2", "p7"],
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  DSA: Custom N-ary Tree  →  TreeNode { name, children[] }        ║
// ║  DFS traversal renders genre sidebar and powers category filter.  ║
// ║  Each level = one genre hierarchy depth. O(n) DFS.               ║
// ╚══════════════════════════════════════════════════════════════════╝
export const CATEGORY_TREE = {
  name: "All",
  children: [
    {
      name: "Technology",
      children: [
        { name: "programming", children: [] },
        { name: "algorithms",  children: [] },
        { name: "systems",     children: [] },
      ],
    },
    {
      name: "Fiction",
      children: [
        { name: "classic",  children: [] },
        { name: "scifi",    children: [] },
        { name: "dystopia", children: [] },
      ],
    },
    {
      name: "Non-Fiction",
      children: [
        { name: "history",    children: [] },
        { name: "psychology", children: [] },
        { name: "science",    children: [] },
      ],
    },
    {
      name: "Self-Help",
      children: [
        { name: "productivity", children: [] },
        { name: "habits",       children: [] },
      ],
    },
  ],
};
