const ICONS = {
  Technology: "💻",
  Fiction:    "📖",
  "Non-Fiction": "🧠",
  "Self-Help": "🚀",
};

export default function CategoryTree({ node, onSelect, selected }) {
  if (!node) return null;

  return (
    <div className="cat-tree">
      {/* All Books */}
      <button
        className={`cat-all ${selected === "All" ? "cat-selected" : ""}`}
        onClick={() => onSelect("All")}
      >
        🗂️ All Books
      </button>

      {/* Parent groups */}
      {node.children?.map(parent => (
        <div key={parent.name} className="cat-group">
          <button
            className={`cat-parent ${selected === parent.name ? "cat-selected" : ""}`}
            onClick={() => onSelect(parent.name)}
          >
            <span>{ICONS[parent.name] || "📁"}</span>
            {parent.name}
          </button>
          {parent.children?.length > 0 && (
            <div className="cat-children">
              {parent.children.map(child => (
                <button
                  key={child.name}
                  className={`cat-child ${selected === child.name ? "cat-selected" : ""}`}
                  onClick={() => onSelect(child.name)}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
