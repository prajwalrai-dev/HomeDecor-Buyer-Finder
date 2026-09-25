import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/api";

const CATEGORIES = [
  "Furniture", "Wall Decor", "Lighting", "Rugs & Carpets", "Curtains & Textiles",
  "Vases & Planters", "Candles & Fragrance", "Kitchen & Dining", "Bedding", "Outdoor Decor", "Other",
];

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida",
  "Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine",
  "Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska",
  "Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota",
  "Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee",
  "Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", category: CATEGORIES[0], price: "", quantityAvailable: 1,
    state: "New York", imageUrl: "", tags: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        quantityAvailable: Number(form.quantityAvailable),
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      const { data } = await createProduct(payload);
      navigate(`/buyers?productId=${data.product._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Add a New Product</h2>
      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" required value={form.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows={4} required value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Price (USD)</label>
            <input type="number" name="price" min="0" step="0.01" required value={form.price} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Quantity Available</label>
            <input type="number" name="quantityAvailable" min="0" value={form.quantityAvailable} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>State (US)</label>
            <select name="state" value={form.state} onChange={handleChange}>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Image URL (optional)</label>
            <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>Tags (comma separated, optional)</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="boho, handmade, ceramic" />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save & Find Buyers"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
