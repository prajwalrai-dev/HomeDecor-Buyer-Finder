const { getLocalBuyers, syncBuyersFromExternalAPI } = require("./buyerService");

/**
 * matchingService figures out WHICH buyers are the best fit for a given
 * seller product, and ranks them by relevance:
 *   +2 points  -> buyer is interested in the product's category
 *   +1 point   -> buyer is in the same US state as the product (lower shipping/logistics friction)
 * Buyers with a score of 0 are excluded from the results.
 */
const findMatchingBuyers = async (product) => {
  // Try to pull fresh leads from an external directory API (no-op if not configured)
  await syncBuyersFromExternalAPI({ category: product.category, state: product.state });

  // Pull the full candidate pool interested in this category (state is used for scoring, not filtering,
  // since sellers may still want to reach buyers nationwide).
  const candidates = await getLocalBuyers({ category: product.category });

  const scored = candidates.map((buyer) => {
    let score = 0;
    if (buyer.categoriesInterested.includes(product.category)) score += 2;
    if (buyer.state && product.state && buyer.state.toLowerCase() === product.state.toLowerCase()) score += 1;

    return { buyer, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => ({ ...entry.buyer.toObject(), matchScore: entry.score }));
};

module.exports = { findMatchingBuyers };
