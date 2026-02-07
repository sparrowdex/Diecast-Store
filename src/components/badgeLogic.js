/**
 * Logic gate to determine unlocked Genre Badges.
 * A badge is unlocked when the user owns all exhibits within a specific genre.
 */

export const GENRE_METADATA = {
  CLASSIC_VINTAGE: { label: "Classic & Vintage", badge: "🏆", description: "Master of the Golden Era" },
  RACE_COURSE: { label: "Race Course", badge: "🏁", description: "Track Day Specialist" },
  CITY_LIFE: { label: "City Life", badge: "🏙️", description: "Urban Commuter" },
  SUPERPOWERS: { label: "Superpowers", badge: "⚡", description: "Exotic Performance" },
  LUXURY_REDEFINED: { label: "Luxury Redefined", badge: "💎", description: "The Executive Suite" },
  OFF_ROAD: { label: "Off-Road", badge: "⛰️", description: "All-Terrain Explorer" },
  FUTURE_PROOF: { label: "Future Proof", badge: "🚀", description: "Next-Gen Visionary" }
};

export const getGenreCompletion = (userCollection, allProducts) => {
  const genres = Object.keys(GENRE_METADATA);
  const ownedIds = new Set(userCollection.map(item => item.productId));

  return genres.map(genre => {
    const genreProducts = allProducts.filter(p => p.genre === genre);
    const total = genreProducts.length;
    const owned = genreProducts.filter(p => ownedIds.has(p.id)).length;
    
    return {
      id: genre,
      total,
      owned,
      isComplete: total > 0 && owned === total
    };
  });
};

export const getUnlockedBadges = (userCollection, allProducts) => {
  return getGenreCompletion(userCollection, allProducts)
    .filter(g => g.isComplete)
    .map(g => g.id);
};