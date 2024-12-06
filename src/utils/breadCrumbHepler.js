export function findCategoryById(categories, id) {
    for (const category of categories) {
        if (category.categoryId == id) return category;
        if (category.subCategories?.length > 0) {
            const subCategory = findCategoryById(category.subCategories, id);
            if (subCategory) return subCategory;
        }
    }
    return null;
}