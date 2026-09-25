import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>
          🏺 Home Decor Buyer Finder
        </Link>
        <div style={styles.links}>
          {user ? (
            <>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              <Link to="/add-product" style={styles.link}>Add Product</Link>
              <Link to="/buyers" style={styles.link}>Buyers</Link>
              <span style={styles.userTag}>{user.name}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: { background: "#fff", borderBottom: "1px solid #e6dcd2", position: "sticky", top: 0, zIndex: 10 },
  inner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  brand: { fontWeight: 700, fontSize: 18, color: "#7a4b2f" },
  links: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  link: { color: "#2e2420", fontSize: 14, fontWeight: 500 },
  userTag: { fontSize: 13, color: "#7d6e64" },
};

export default Navbar;
