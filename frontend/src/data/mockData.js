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
export const BOOK_DESCRIPTIONS = {
  p1:  "A collection of tips and tricks for software developers, covering everything from code craftsmanship to career building. Essential reading for anyone serious about programming.",
  p2:  "A handbook of agile software craftsmanship. Martin shows what good, clean code looks like — how to write it, how to read it, and how to transform bad code into clean code.",
  p3:  "Set in a distant future where desert planet Arrakis is the only source of the universe's most valuable substance, Dune is a sweeping tale of politics, religion, and human ambition.",
  p4:  "A dystopian novel set in a totalitarian society under constant surveillance. Winston Smith's rebellion against Big Brother remains one of literature's most powerful warnings.",
  p5:  "A brief history of humankind, from the Stone Age to the 21st century. Harari explores how biology and history shaped us and raises profound questions about our future.",
  p6:  "An easy and proven way to build good habits and break bad ones. Clear reveals the surprising power of small changes and how tiny habits compound into remarkable results.",
  p7:  "The gold standard reference for algorithms. Covers sorting, graph algorithms, dynamic programming, and more with rigorous mathematical analysis. Used in top CS programs worldwide.",
  p8:  "The story of Santiago, an Andalusian shepherd boy who dreams of worldly treasure. A fable about following your dreams and listening to your heart — beloved by millions worldwide.",
  p9:  "Explores the two systems that drive the way we think: fast, intuitive thinking and slow, deliberate thinking. Kahneman reveals the biases that shape our judgments and decisions.",
  p10: "Argues that the ability to focus deeply on demanding tasks is becoming rare and increasingly valuable. Newport shows how to cultivate focus in a world full of distraction.",
  p11: "A tragic tale of the fabulously wealthy Jay Gatsby and his obsession with the beautiful Daisy Buchanan. A timeless critique of the American Dream and the hollowness of wealth.",
  p12: "A deep dive into the infrastructure of modern data systems — databases, stream processing, and distributed systems. The definitive guide for engineers building data-intensive applications.",
};

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
