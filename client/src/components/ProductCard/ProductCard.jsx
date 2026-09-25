import { Link } from "react-router-dom";

const ProductCard = ({ product, onDelete }) => {
  return (
    <div className="card">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.title}
          style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8, marginBottom: 10 }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 150,
            borderRadius: 8,
            marginBottom: 10,
            background: "#f1e6da",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#a9683d",
            fontSize: 13,
          }}
        >
          No image
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <h3 style={{ margin: "0 0 4px" }}>{product.title}</h3>
        <span className="badge">{product.status}</span>
      </div>
      <p style={{ fontSize: 13, color: "#7d6e64", margin: "4px 0" }}>
        {product.category} · {product.state}
      </p>
      <p style={{ fontWeight: 600, margin: "6px 0" }}>${product.price}</p>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <Link to={`/buyers?productId=${product._id}`} className="btn" style={{ fontSize: 13 }}>
          Find Buyers
        </Link>
        {onDelete && (
          <button
            className="btn btn-secondary"
            style={{ fontSize: 13 }}
            onClick={() => onDelete(product._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
