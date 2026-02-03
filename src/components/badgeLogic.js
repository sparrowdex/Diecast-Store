/**
 * Logic gate to determine unlocked Genre Badges.
 * A badge is unlocked when the user owns all exhibits within a specific genre.
 */
export const getGenreCompletion = (userCollection, allProducts) => {
  const genres = [
    'CLASSIC_VINTAGE',
    'RACE_COURSE',
    'CITY_LIFE',
    'SUPERPOWERS',
    'LUXURY_REDEFINED',
    'OFF_ROAD',
    'FUTURE_PROOF'
  ];

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