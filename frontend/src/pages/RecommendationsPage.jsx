import { useState } from "react";
import { bfsRecommend, useStore } from "../store/useStore";
import ProductCard from "../components/ProductCard";

export default function RecommendationsPage({ setPage }) {
  const { state, dispatch } = useStore();
  const { catalog } = state;
  const [selected, setSelected] = useState(null);
  const [depth, setDepth] = useState(2);

  const book = selected ?? catalog[0];
  const recs = book ? bfsRecommend(book.id, catalog, depth) : [];

  if (!catalog.length) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      {/* DSA: Graph + BFS  →  Map<Book, Set<Book>> adjacency map
           BFS frontier expands level by level, HashSet tracks visited nodes. O(V+E) */}
      <h2>🤝 Recommendations</h2>

      <div className="rec-controls">
        <label>
          Base product:
          <select value={book?.id ?? ""} onChange={e => setSelected(catalog.find(p => p.id === e.target.value))}>
            {catalog.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label>
          BFS depth:
          <select value={depth} onChange={e => setDepth(+e.target.value)}>
            {[1, 2, 3].map(d => <option key={d}>{d}</option>)}
          </select>
        </label>
      </div>

      <div className="rec-seed">
        <p>Readers who bought <strong>{book?.name}</strong> also bought:</p>
      </div>

      {recs.length === 0
        ? <p className="empty">No recommendations found at depth {depth}.</p>
        : <div className="product-grid">{recs.map(p => <ProductCard key={p.id} product={p} setPage={setPage} />)}</div>
      }
    </div>
  );
}
