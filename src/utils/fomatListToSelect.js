export const   fomatListToSelection = (categories, level = 0) => {
    let result = [];
    // result.push({
    //     value: '',
    //     label: 'Không',
    // });
    categories.forEach((category) => {
        result.push({
            value: category.categoryId,
            label: `${'—'.repeat(level)} ${category.name}`,
        });

        // Recursively process subcategories
        if (category.subCategories && category.subCategories.length > 0) {
            result = result.concat(fomatListToSelection(category.subCategories, level + 1));
        }
    });
    return result;
};
export const   fomatListLanguageToSelection = (languages) => {
    let result = [];
    languages.forEach((language) => {
        result.push({
            value: language.languageId,
            label: `${language.name}`,
        });
    });
    return result;
};
export const   fomatListBookCoverTypeToSelection = (bookCovertypes) => {
    let result = [];
    bookCovertypes.forEach((bookCovertype) => {
        result.push({
            value: bookCovertype.bookCoverTypeId,
            label: `${bookCovertype.name}`,
        });
    });
    return result;
};