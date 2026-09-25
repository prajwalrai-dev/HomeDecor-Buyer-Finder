const axios = require("axios");
const Buyer = require("../models/Buyer");

/**
 * buyerService is responsible for SOURCING buyer records.
 * It always reads from the local MongoDB "buyers" collection, and, if an
 * external buyer-directory API is configured via BUYER_API_URL / BUYER_API_KEY
 * in .env, it will also pull fresh buyer leads from that API and upsert them
 * into the local collection so the matching service can query everything
 * from one place.
 *
 * This keeps the app functional out-of-the-box with the seeded local buyer
 * database, while leaving a clean integration point for a real B2B/US
 * business directory API (e.g. a wholesale marketplace or retailer directory).
 */

// Pulls buyer leads from an external API, if configured, and stores them locally.
const syncBuyersFromExternalAPI = async ({ category, state } = {}) => {
  const apiUrl = process.env.BUYER_API_URL;
  const apiKey = process.env.BUYER_API_KEY;

  if (!apiUrl) {
    // No external API configured -> silently skip, local DB is used instead.
    return { synced: 0, skipped: true };
  }

  try {
    const response = await axios.get(apiUrl, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      params: { category, state, country: "US" },
      timeout: 8000,
    });

    const externalBuyers = Array.isArray(response.data) ? response.data : response.data.results || [];

    let syncedCount = 0;
    for (const b of externalBuyers) {
      if (!b.email || !b.companyName) continue;

      await Buyer.findOneAndUpdate(
        { email: b.email.toLowerCase() },
        {
          companyName: b.companyName,
          contactName: b.contactName || "",
          email: b.email.toLowerCase(),
          phone: b.phone || "",
          categoriesInterested: b.categoriesInterested || (category ? [category] : []),
          state: b.state || state || "Unknown",
          city: b.city || "",
          buyerType: b.buyerType || "Retailer",
          source: "external_api",
          active: true,
        },
        { upsert: true, new: true }
      );
      syncedCount += 1;
    }

    return { synced: syncedCount, skipped: false };
  } catch (error) {
    console.error("Buyer external API sync failed:", error.message);
    return { synced: 0, skipped: false, error: error.message };
  }
};

// Returns all active buyers in the local database, optionally filtered.
const getLocalBuyers = async ({ category, state } = {}) => {
  const query = { active: true };
  if (category) query.categoriesInterested = category;
  if (state) query.state = new RegExp(`^${state}$`, "i");
  return Buyer.find(query).sort({ createdAt: -1 });
};

module.exports = { syncBuyersFromExternalAPI, getLocalBuyers };
