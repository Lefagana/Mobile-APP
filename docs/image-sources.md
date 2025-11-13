# Image Sources Documentation

This document lists all the external images used in the Wakanda-X app, along with their sources, licenses, and attribution information.

## License Information

All images used in this project are from **Unsplash**, which provides free-to-use images under the [Unsplash License](https://unsplash.com/license):
- ✅ Free to use for commercial and non-commercial purposes
- ✅ No attribution required (but appreciated)
- ✅ Can be downloaded and used without permission
- ❌ Cannot be compiled into a competing product/service

## Product Images

### Groceries Category

| Product | Image URL | Photo ID | Description |
|---------|-----------|----------|-------------|
| **Groundnut Oil - 1L** | `https://source.unsplash.com/featured/600x600?groundnut%20oil,bottle` | Dynamic | Oil bottle product photo |
| **Rice - 10kg Bag** | `https://source.unsplash.com/featured/600x600?rice%20bag,10kg` | Dynamic | Rice bag photo |
| **Palm Oil - 2L** | `https://source.unsplash.com/featured/600x600?palm%20oil,bottle` | Dynamic | Palm oil bottle |
| **Spaghetti - 500g** | `https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=600&fit=crop` | photo-1621996346565 | Pasta/spaghetti product |
| **Tomato Paste - 400g** | `https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&h=600&fit=crop` | photo-1546548970-71785318a17b | Canned tomato product |

### Fashion Category

| Product | Image URL | Photo ID | Description |
|---------|-----------|----------|-------------|
| **Ankara Dress - Blue Pattern** | `https://source.unsplash.com/featured/600x600?ankara%20dress,african%20print` | Dynamic | African print dress |
| **Ankara Two-Piece - Green** | `https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=600&fit=crop` | photo-1617127365659 | African fashion two-piece |
| **African Print Shirt - Men** | `https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop` | photo-1602810318383 | Men's African print shirt |

### Electronics Category

| Product | Image URL | Photo ID | Description |
|---------|-----------|----------|-------------|
| **Samsung Galaxy A14** | `https://source.unsplash.com/featured/600x600?samsung%20smartphone,galaxy` | Dynamic | Smartphone product |
| **Wireless Bluetooth Headphones** | `https://source.unsplash.com/featured/600x600?bluetooth%20headphones,product` | Dynamic | Wireless headphones |
| **iPhone 13 - 128GB** | `https://images.unsplash.com/photo-1632633173522-c8d0a8a26a14?w=600&h=600&fit=crop` | photo-1632633173522 | iPhone product photo |
| **Sony Headphones WH-1000XM4** | `https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop` | photo-1546435770-a3e426bf472b | Premium headphones |

### Kids Category

| Product | Image URL | Photo ID | Description |
|---------|-----------|----------|-------------|
| **Children's School Uniform Set** | `https://source.unsplash.com/featured/600x600?school%20uniform,children` | Dynamic | School uniform |
| **Baby Stroller - 3-in-1** | `https://images.unsplash.com/photo-1544963150-f8695fdb73fe?w=600&h=600&fit=crop` | photo-1544963150-f8695fdb73fe | Baby stroller product |
| **Toy Car Set - 10 Pieces** | `https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&h=600&fit=crop` | photo-1558060370-d644479cb6f7 | Toy cars |

### Shoes Category

| Product | Image URL | Photo ID | Description |
|---------|-----------|----------|-------------|
| **Leather Sandals - Brown** | `https://source.unsplash.com/featured/600x600?leather%20sandals,brown` | Dynamic | Brown leather sandals |
| **Nike Air Max** | `https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop` | photo-1606107557195 | Nike sneakers |
| **Canvas Sneakers - White** | `https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop` | photo-1525966222134 | White canvas sneakers |

## Profile & Avatar Images

| Usage | Image URL | Photo ID | Description |
|-------|-----------|----------|-------------|
| **Rider Photo** | `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop` | photo-1507003211169 | Professional male portrait |
| **Review User Photo** | `https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&h=200&fit=crop` | photo-1560393464-5c69a73c5770 | User review avatar |

## Fallback/Default Images

When products or users don't have specific images, the app uses these default Unsplash images:

| Usage | Image URL | Photo ID | Description | Used In |
|-------|-----------|----------|-------------|----------|
| **Default User Avatar** | `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop` | photo-1535713875002 | Professional portrait | Profile.tsx, EditProfile.tsx, ChatWindow.tsx, ConversationList.tsx |
| **Default Product Image** | `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop` | photo-1505740420928 | Wireless headphones | Cart.tsx, OrdersList.tsx, OrderDetail.tsx, ReturnRequest.tsx |

These fallbacks ensure:
- **Professional appearance**: Even without custom images, the app looks polished
- **Consistent UX**: Users always see relevant imagery
- **Graceful degradation**: No broken image placeholders

## Image URL Parameters

All Unsplash images use these optimized parameters:
- `w=600&h=600` - Width and height for product images (1:1 aspect ratio)
- `w=100&h=100` - Width and height for avatar images
- `fit=crop` - Ensures images fill the frame without distortion
- `q=80` - Quality setting (optional, defaults to auto)
- `auto=format` - Automatic format optimization (optional)

## Dynamic vs Static URLs

### Dynamic URLs (source.unsplash.com/featured)
- Uses Unsplash's search API to dynamically fetch relevant images
- **Pros**: Always finds relevant images based on keywords
- **Cons**: Images may change over time
- Used for: Initial products with generic search terms

### Static URLs (images.unsplash.com/photo-{ID})
- Direct link to specific Unsplash photos
- **Pros**: Stable, consistent images that won't change
- **Cons**: Requires manual curation
- Used for: Newly added products and critical UI elements

## Performance Considerations

1. **Image Sizing**: All images are requested at appropriate sizes (600x600 for products, 100x100 for avatars)
2. **Format Optimization**: Unsplash automatically serves WebP or JPEG based on browser support
3. **CDN Delivery**: Unsplash uses Fastly CDN for fast global delivery
4. **Caching**: Images are cached by the browser and React Native Image component

## Future Improvements

- [ ] Add image compression/optimization for faster loading
- [ ] Implement lazy loading for product images
- [ ] Add blur-up placeholder technique for better UX
- [ ] Consider self-hosting critical images for better control
- [ ] Add local Nigerian product photography for authenticity
- [ ] Implement image upload feature for vendors

## Attribution

While Unsplash doesn't require attribution, we acknowledge the following:

**Photography provided by Unsplash** - https://unsplash.com

For specific photographer credits, visit each photo's Unsplash page using the format:
`https://unsplash.com/photos/{PHOTO_ID}`

Example: `https://unsplash.com/photos/photo-1617127365659-c47fa864d8bc`

---

**Last Updated**: November 11, 2024  
**Maintained By**: Wakanda-X Development Team
