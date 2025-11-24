// Product image mapping for local assets
// Maps product IDs or image keys to local image sources

export const LOCAL_PRODUCT_IMAGES: Record<string, any> = {
    // Groceries
    'prod_001': require('../../assets/products/groundnut_oil.png'),
    'prod_002': require('../../assets/products/rice_bag.png'),
    'prod_007': require('../../assets/products/palm_oil.png'),
    'prod_017': require('../../assets/products/spaghetti.png'),
    'prod_018': require('../../assets/products/tomato_paste.png'),

    // Fashion
    'prod_003': require('../../assets/products/ankara_dress.png'),
    'prod_009': require('../../assets/products/ankara_two_piece.png'),
    'prod_010': require('../../assets/products/african_shirt.png'),

    // Electronics
    'prod_004': require('../../assets/products/samsung_galaxy_a14.png'),
    'prod_008': require('../../assets/products/wireless_headphones.png'),
    'prod_011': require('../../assets/products/iphone_13.png'),
    'prod_012': require('../../assets/products/sony_headphones.png'),

    // Kids
    'prod_005': require('../../assets/products/school_uniform.png'),
    'prod_013': require('../../assets/products/baby_stroller.png'),
    'prod_014': require('../../assets/products/toy_car.png'),

    // Shoes
    'prod_006': require('../../assets/products/leather_sandals.png'),
    'prod_015': require('../../assets/products/nike_air_max.png'),
    'prod_016': require('../../assets/products/canvas_sneakers.png'),
};

/**
 * Get the image source for a product
 * Returns local image if available, otherwise returns URI format for remote images
 */
export const getProductImageSource = (productId: string, imageUrl?: string) => {
    // Check if we have a local image for this product
    if (LOCAL_PRODUCT_IMAGES[productId]) {
        return LOCAL_PRODUCT_IMAGES[productId];
    }

    // Otherwise use the remote URL
    if (imageUrl) {
        return { uri: imageUrl };
    }

    return undefined;
};
