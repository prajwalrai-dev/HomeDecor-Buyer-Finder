import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMyProducts, getMatchingBuyers, getAllBuyers, sendProductEmail } from "../services/api";
import BuyerCard from "../components/BuyerCard/BuyerCard";
import Loader from "../components/Loader/Loader";

const Buyers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = searchParams.get("productId") || "";

  const [products, setProducts] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getMyProducts().then((res) => setProducts(res.data.products));
  }, []);

  const loadBuyers = async (pid) => {
    setLoading(true);
    setStatus(null);
    setSelected([]);
    try {
      if (pid) {
        const { data } = await getMatchingBuyers(pid);
        setBuyers(data.buyers);
      } else {
        const { data } = await getAllBuyers();
        setBuyers(data.buyers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuyers(productId);
  }, [productId]);

  const handleProductChange = (e) => {
    const pid = e.target.value;
    setSearchParams(pid ? { productId: pid } : {});
  };

  const toggleBuyer = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => setSelected(buyers.map((b) => b._id));
  const clearAll = () => setSelected([]);

  const handleSendEmails = async () => {
    if (!productId) {
      setStatus({ type: "error", message: "Select a product first to send emails about it." });
      return;
    }
    if (selected.length === 0) {
      setStatus({ type: "error", message: "Select at least one buyer." });
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      const { data } = await sendProductEmail({ productId, buyerIds: selected, customMessage });
      const sentCount = data.results.filter((r) => r.status === "sent").length;
      const failedCount = data.results.length - sentCount;
      setStatus({
        type: failedCount === 0 ? "success" : "warning",
        message: `${sentCount} email(s) sent successfully${failedCount ? `, ${failedCount} failed` : ""}.`,
      });
      setSelected([]);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Failed to send emails" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container">
      <div className="page-title">
        <h2>Find Buyers</h2>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="form-group">
          <label>Filter buyers by one of your products (recommended for best matches)</label>
          <select value={productId} onChange={handleProductChange}>
            <option value="">All buyers (no product filter)</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.title} — {p.category}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loader label="Finding matching buyers..." />
      ) : buyers.length === 0 ? (
        <div className="empty-state card">No buyers found. Try selecting a different product or category.</div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ color: "#7d6e64", fontSize: 14 }}>{buyers.length} buyer(s) found · {selected.length} selected</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary" onClick={selectAll}>Select All</button>
              <button className="btn btn-secondary" onClick={clearAll}>Clear</button>
            </div>
          </div>

          <div className="grid grid-3" style={{ marginBottom: 24 }}>
            {buyers.map((b) => (
              <BuyerCard key={b._id} buyer={b} selected={selected.includes(b._id)} onToggle={toggleBuyer} />
            ))}
          </div>

          <div className="card" style={{ maxWidth: 560 }}>
            <h3>Send Email to Selected Buyers</h3>
            <div className="form-group">
              <label>Custom message (optional)</label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add a personal note to include in the email..."
              />
            </div>
            {status && (
              <p className={status.type === "error" ? "error-text" : ""} style={{ color: status.type === "success" ? "#2f6b2c" : status.type === "warning" ? "#a9683d" : undefined }}>
                {status.message}
              </p>
            )}
            <button className="btn" onClick={handleSendEmails} disabled={sending}>
              {sending ? "Sending..." : `Send Email to ${selected.length} Buyer(s)`}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Buyers;
