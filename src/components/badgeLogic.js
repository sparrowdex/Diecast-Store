/**
 * Logic gate to determine unlocked Genre Badges.
 * A badge is unlocked when the user owns all exhibits within a specific genre.
 */

export const GENRE_METADATA = {
  CLASSIC_VINTAGE: { label: "Classic & Vintage", badge: "🏆", description: "Master of the Golden Era", color: "#4B3621", rankName: "VINTAGE_CONNOISSEUR" },
  RACE_COURSE: { label: "Race Course", badge: "🏁", description: "Track Day Specialist", color: "#FF4500", rankName: "TRACK_LEGEND" },
  CITY_LIFE: { label: "City Life", badge: "🏙️", description: "Urban Commuter", color: "#007BFF", rankName: "URBAN_ELITE" },
  SUPERPOWERS: { label: "Superpowers", badge: "⚡", description: "Exotic Performance", color: "#800080", rankName: "HYPERCAR_HERO" },
  LUXURY_REDEFINED: { label: "Luxury Redefined", badge: "💎", description: "The Executive Suite", color: "#D4AF37", rankName: "GRAND_EXECUTIVE" },
  OFF_ROAD: { label: "Off-Road", badge: "⛰️", description: "All-Terrain Explorer", color: "#228B22", rankName: "TERRAIN_MASTER" },
  FUTURE_PROOF: { label: "Future Proof", badge: "🚀", description: "Next-Gen Visionary", color: "#C0C0C0", rankName: "NEO_COLLECTOR" }
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