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

// Book metadata: pages, publisher, ISBN, year, format, badges
export const BOOK_META = {
  p1:  { pages: 352, publisher: "Addison-Wesley",    isbn: "978-0-201-61622-4", year: 1999, formats: ["Paperback","eBook"],          badge: "Bestseller" },
  p2:  { pages: 431, publisher: "Prentice Hall",     isbn: "978-0-13-235088-4", year: 2008, formats: ["Paperback","Hardcover","eBook"], badge: "Bestseller" },
  p3:  { pages: 896, publisher: "Chilton Books",     isbn: "978-0-441-17271-9", year: 1965, formats: ["Paperback","Hardcover","eBook"], badge: "Award Winner" },
  p4:  { pages: 328, publisher: "Secker & Warburg",  isbn: "978-0-452-28423-4", year: 1949, formats: ["Paperback","eBook"],          badge: "Classic" },
  p5:  { pages: 443, publisher: "Harper",            isbn: "978-0-06-231609-7", year: 2011, formats: ["Paperback","Hardcover","eBook"], badge: "Bestseller" },
  p6:  { pages: 320, publisher: "Avery",             isbn: "978-0-73-521188-8", year: 2018, formats: ["Paperback","Hardcover","eBook"], badge: "#1 Bestseller" },
  p7:  { pages: 1312, publisher: "MIT Press",        isbn: "978-0-26-204630-5", year: 2009, formats: ["Hardcover","eBook"],          badge: "Textbook" },
  p8:  { pages: 197, publisher: "HarperOne",         isbn: "978-0-06-112241-5", year: 1988, formats: ["Paperback","eBook"],          badge: "Classic" },
  p9:  { pages: 499, publisher: "Farrar Straus",     isbn: "978-0-37-453355-7", year: 2011, formats: ["Paperback","Hardcover","eBook"], badge: "Nobel Prize" },
  p10: { pages: 296, publisher: "Grand Central",     isbn: "978-1-45-552384-9", year: 2016, formats: ["Paperback","Hardcover","eBook"], badge: "Bestseller" },
  p11: { pages: 180, publisher: "Scribner",          isbn: "978-0-74-327356-5", year: 1925, formats: ["Paperback","eBook"],          badge: "Classic" },
  p12: { pages: 611, publisher: "O'Reilly Media",    isbn: "978-1-44-937332-0", year: 2017, formats: ["Paperback","eBook"],          badge: "Editor's Pick" },
};

// Star rating distribution (simulated review counts per star)
export const RATING_DIST = {
  p1:  [12, 18, 45, 89, 312],
  p2:  [8,  14, 38, 76, 287],
  p3:  [5,  9,  28, 94, 401],
  p4:  [10, 15, 41, 88, 356],
  p5:  [14, 22, 53, 112, 389],
  p6:  [7,  11, 29, 81, 334],
  p7:  [18, 27, 61, 98, 278],
  p8:  [20, 31, 67, 102, 245],
  p9:  [15, 23, 54, 93, 267],
  p10: [9,  16, 42, 88, 312],
  p11: [22, 38, 74, 118, 289],
  p12: [6,  10, 24, 67, 298],
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
