# Image Sources and Licensing

This document tracks external image sources used in the Wakanda-X mock data for development and demo purposes.

General policy
- Sources: Unsplash, Pexels, and Wikimedia Commons (as approved).
- Style: Minimalistic product-on-plain-background where possible; local/Nigerian market flavor preferred.
- Implementation: Images are currently fetched via Unsplash Source API with curated queries to match each product type. These are dynamic images and may vary over time, but remain relevant.
- Licensing: Unsplash License allows free use without attribution (though attribution is appreciated). If we later switch to Wikimedia assets, we will include explicit CC attributions here per image.

Current implementation (dynamic via Unsplash Source)
- Groundnut Oil (prod_001)
  - URL pattern: https://source.unsplash.com/featured/600x600?groundnut%20oil,bottle
  - Source: Unsplash (dynamic)
- Rice Bag (prod_002)
  - URL pattern: https://source.unsplash.com/featured/600x600?rice%20bag,10kg
  - Source: Unsplash (dynamic)
- Ankara Dress (prod_003)
  - URL pattern: https://source.unsplash.com/featured/600x600?ankara%20dress,african%20print
  - Source: Unsplash (dynamic)
- Samsung Smartphone (prod_004)
  - URL pattern: https://source.unsplash.com/featured/600x600?samsung%20smartphone,galaxy
  - Source: Unsplash (dynamic)
- School Uniform Set (prod_005)
  - URL pattern: https://source.unsplash.com/featured/600x600?school%20uniform,children
  - Source: Unsplash (dynamic)
- Leather Sandals (prod_006)
  - URL pattern: https://source.unsplash.com/featured/600x600?leather%20sandals,brown
  - Source: Unsplash (dynamic)
- Palm Oil (prod_007)
  - URL pattern: https://source.unsplash.com/featured/600x600?palm%20oil,bottle
  - Source: Unsplash (dynamic)
- Bluetooth Headphones (prod_008)
  - URL pattern: https://source.unsplash.com/featured/600x600?bluetooth%20headphones,product
  - Source: Unsplash (dynamic)

Notes
- Because the Unsplash Source API returns a relevant image that can change over time, screenshots may vary between sessions. For truly fixed visuals (e.g., for store listings or tests), we can pin to specific photo IDs from Unsplash or use Wikimedia Commons files with stable URLs and add explicit attributions here.
- If you prefer fully offline or bundled images, we can add assets under `src/assets/images/` and update the mock data to reference local image files.
