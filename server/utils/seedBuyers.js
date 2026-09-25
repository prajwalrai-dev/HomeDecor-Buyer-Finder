/**
 * Run with: npm run seed
 * Populates the local buyer database with sample U.S. home decor buyers
 * (retailers, boutiques, interior designers, distributors) so the app
 * is usable immediately without an external API key.
 */
require("dotenv").config();
const connectDB = require("./database");
const Buyer = require("../models/Buyer");

const sampleBuyers = [
  { companyName: "UrbanNest Living", contactName: "Rachel Kim", email: "buying@urbannestliving.com", state: "New York", city: "Brooklyn", buyerType: "Retailer", categoriesInterested: ["Furniture", "Wall Decor", "Lighting"] },
  { companyName: "The Cozy Cottage Co.", contactName: "Mark Daniels", email: "purchasing@cozycottageco.com", state: "Texas", city: "Austin", buyerType: "Boutique", categoriesInterested: ["Curtains & Textiles", "Bedding", "Candles & Fragrance"] },
  { companyName: "Sunset Interiors Studio", contactName: "Priya Nair", email: "priya@sunsetinteriors.design", state: "California", city: "Los Angeles", buyerType: "Interior Designer", categoriesInterested: ["Furniture", "Rugs & Carpets", "Lighting"] },
  { companyName: "GreenLeaf Home Distributors", contactName: "Tom Becker", email: "sourcing@greenleafhome.com", state: "Illinois", city: "Chicago", buyerType: "Distributor", categoriesInterested: ["Vases & Planters", "Outdoor Decor"] },
  { companyName: "Coastal Charm Boutique", contactName: "Emily Foster", email: "orders@coastalcharmboutique.com", state: "Florida", city: "Miami", buyerType: "Boutique", categoriesInterested: ["Wall Decor", "Vases & Planters", "Candles & Fragrance"] },
  { companyName: "Modern Hearth Retail Group", contactName: "James Liu", email: "buyers@modernhearth.com", state: "Washington", city: "Seattle", buyerType: "Retailer", categoriesInterested: ["Furniture", "Lighting", "Kitchen & Dining"] },
  { companyName: "Prairie Home Decor Co.", contactName: "Susan Miller", email: "susan@prairiehomedecor.com", state: "Colorado", city: "Denver", buyerType: "Retailer", categoriesInterested: ["Rugs & Carpets", "Curtains & Textiles", "Bedding"] },
  { companyName: "Elm & Oak Interiors", contactName: "David Chen", email: "procurement@elmoakinteriors.com", state: "Massachusetts", city: "Boston", buyerType: "Interior Designer", categoriesInterested: ["Furniture", "Wall Decor"] },
  { companyName: "Desert Bloom Home Store", contactName: "Alicia Gomez", email: "alicia@desertbloomhome.com", state: "Arizona", city: "Phoenix", buyerType: "Retailer", categoriesInterested: ["Vases & Planters", "Outdoor Decor", "Lighting"] },
  { companyName: "BrightNest E-Commerce", contactName: "Ryan Patel", email: "vendors@brightnestshop.com", state: "New Jersey", city: "Newark", buyerType: "E-commerce Store", categoriesInterested: ["Kitchen & Dining", "Bedding", "Candles & Fragrance"] },
  { companyName: "Heritage House Furnishings", contactName: "Karen White", email: "karen@heritagehousefurnishings.com", state: "Georgia", city: "Atlanta", buyerType: "Retailer", categoriesInterested: ["Furniture", "Rugs & Carpets"] },
  { companyName: "Lakeside Living Boutique", contactName: "Nathan Brooks", email: "nathan@lakesidelivingco.com", state: "Michigan", city: "Ann Arbor", buyerType: "Boutique", categoriesInterested: ["Wall Decor", "Candles & Fragrance", "Curtains & Textiles"] },
  { companyName: "Southern Charm Distributors", contactName: "Olivia Turner", email: "sales@southerncharmdist.com", state: "North Carolina", city: "Charlotte", buyerType: "Distributor", categoriesInterested: ["Outdoor Decor", "Lighting", "Furniture"] },
  { companyName: "Pacific Grove Interiors", contactName: "Michael Tran", email: "michael@pacificgroveinteriors.com", state: "Oregon", city: "Portland", buyerType: "Interior Designer", categoriesInterested: ["Vases & Planters", "Wall Decor", "Lighting"] },
  { companyName: "Mountain Ridge Home Goods", contactName: "Laura Simmons", email: "laura@mountainridgehome.com", state: "Utah", city: "Salt Lake City", buyerType: "Retailer", categoriesInterested: ["Rugs & Carpets", "Bedding", "Kitchen & Dining"] },
];

const seed = async () => {
  await connectDB();
  try {
    for (const buyer of sampleBuyers) {
      await Buyer.findOneAndUpdate(
        { email: buyer.email },
        { ...buyer, source: "local", active: true },
        { upsert: true, new: true }
      );
    }
    console.log(`Seeded ${sampleBuyers.length} buyers successfully.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    process.exit(0);
  }
};

seed();
