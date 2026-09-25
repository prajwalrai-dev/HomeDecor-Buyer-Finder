const BuyerCard = ({ buyer, selected, onToggle }) => {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        borderColor: selected ? "#a9683d" : "#e6dcd2",
        background: selected ? "#fbf3ea" : "#fff",
      }}
    >
      <div>
        <h4 style={{ margin: "0 0 4px" }}>{buyer.companyName}</h4>
        <p style={{ margin: "0 0 2px", fontSize: 13, color: "#7d6e64" }}>
          {buyer.buyerType} · {buyer.city ? `${buyer.city}, ` : ""}{buyer.state}
        </p>
        <p style={{ margin: "0 0 2px", fontSize: 13 }}>{buyer.email}</p>
        <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(buyer.categoriesInterested || []).map((cat) => (
            <span key={cat} className="badge">{cat}</span>
          ))}
        </div>
        {buyer.matchScore !== undefined && (
          <p style={{ fontSize: 12, color: "#a9683d", marginTop: 6 }}>Match score: {buyer.matchScore}</p>
        )}
      </div>
      {onToggle && (
        <input
          type="checkbox"
          checked={!!selected}
          onChange={() => onToggle(buyer._id)}
          style={{ width: 18, height: 18 }}
        />
      )}
    </div>
  );
};

export default BuyerCard;
