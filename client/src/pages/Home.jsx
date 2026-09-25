import { Link } from "react-router-dom";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="container">
      <div style={{ textAlign: "center", padding: "60px 16px" }}>
        <h1 style={{ fontSize: 36, marginBottom: 10 }}>Find U.S. Buyers for Your Home Decor Products</h1>
        <p style={{ color: "#7d6e64", maxWidth: 560, margin: "0 auto 26px", fontSize: 16 }}>
          List your handmade or wholesale home decor items, get matched with retailers, boutiques
          and interior designers across the United States, and reach out to them directly by email —
          all from one dashboard.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {user ? (
            <Link to="/dashboard" className="btn">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="btn">Get Started</Link>
              <Link to="/login" className="btn btn-secondary">Login</Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: 40 }}>
        <div className="card">
          <h3>1. List your product</h3>
          <p style={{ color: "#7d6e64", fontSize: 14 }}>
            Add your home decor item with category, price and U.S. state.
          </p>
        </div>
        <div className="card">
          <h3>2. Get matched with buyers</h3>
          <p style={{ color: "#7d6e64", fontSize: 14 }}>
            Our matching engine ranks buyers by category fit and location.
          </p>
        </div>
        <div className="card">
          <h3>3. Email them instantly</h3>
          <p style={{ color: "#7d6e64", fontSize: 14 }}>
            Send a ready-made pitch email to selected buyers in one click.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
