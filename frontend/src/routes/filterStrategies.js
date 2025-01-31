export const filterByCategory = (listings, category) => {
    return category ? listings.filter(listing => listing.category === category) : listings;
};

export const filterByCondition = (listings, condition) => {
    return condition ? listings.filter(listing => listing.condition === condition) : listings;
};

export const sortListingsByPrice = (listings, sortOrder) => {
    return sortOrder === 'desc' ? listings.sort((a, b) => b.price - a.price) : listings.sort((a, b) => a.price - b.price);
};