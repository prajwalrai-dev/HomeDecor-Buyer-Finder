import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProducts, deleteProduct, getEmailLogs } from "../services/api";
import ProductCard from "../components/ProductCard/ProductCard";
import Loader from "../components/Loader/Loader";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, logsRes] = await Promise.all([getMyProducts(), getEmailLogs()]);
      setProducts(productsRes.data.products);
      setLogs(logsRes.data.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) return <Loader label="Loading your dashboard..." />;

  return (
    <div className="container">
      <div className="page-title">
        <h2>Your Products</h2>
        <Link to="/add-product" className="btn">+ Add Product</Link>
      </div>

      {products.length === 0 ? (
        <div className="empty-state card">
          <p>You haven't listed any products yet.</p>
          <Link to="/add-product" className="btn" style={{ marginTop: 10, display: "inline-block" }}>
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="grid grid-3">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <h2 style={{ marginTop: 44 }}>Recent Emails Sent</h2>
      {logs.length === 0 ? (
        <p style={{ color: "#7d6e64" }}>No emails sent yet.</p>
      ) : (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e6dcd2" }}>
                <th style={{ padding: 8 }}>Product</th>
                <th style={{ padding: 8 }}>Buyer</th>
                <th style={{ padding: 8 }}>Status</th>
                <th style={{ padding: 8 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} style={{ borderBottom: "1px solid #f1e6da" }}>
                  <td style={{ padding: 8 }}>{log.product?.title || "—"}</td>
                  <td style={{ padding: 8 }}>{log.buyer?.companyName || log.buyerEmail}</td>
                  <td style={{ padding: 8 }}>
                    <span className="badge" style={{ background: log.status === "sent" ? "#e3f3e1" : "#fbdede", color: log.status === "sent" ? "#2f6b2c" : "#a12626" }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ padding: 8 }}>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
