ceate a higly professional UI of Design of this image![1762273218642](image/homepageprompt/1762273218642.jpg) attache

also take this as an inspiration as its picture half of the design

![1762274973444](image/homepageprompt/1762274973444.png)

use the detail description below for higly quality and accurate result

1. Global Layout Structure
   Orientation: Portrait mobile (inferred from narrow, vertical rectangles and bottom-heavy nav).
   Grid System: Implicit 12-column flexible grid (e.g., header spans full width; content uses 2-4 columns for cards/icons).
2. Spacing/White Space: Generous gutters (e.g., ~16-24px between sections); vertical stacking with subtle dividers (horizontal lines).
3. Typography/Labels:   Sizes: Large for headers (e.g., "Search product"), medium for categories, small for prices/vendors.
4. Icons: Minimalist placeholders (e.g.,camera, search icon, cart bag, user silhouette, phone/email symbols, generic logos as circles/squares). Annotations specify "with icons for wallets & others" in sections.
   Interactions/Flows: Arrows indicate progression (e.g., "=> Stores Browse" from explore icons). Dots/ellipses suggest loading states or expandable carousels (e.g., "..." in bottom shape).
5. Accessibility Notes: No explicit mentions, but implied via clear labeling (e.g., "Category menu") and icon+text pairings—recommend adding ARIA labels in hi-fi.
6. Header Section (Top Bar – Persistent Across Screens)
   This is a sticky top navigation bar (~10-15% of screen height), focused on immediate actions: search, utilities, and quick commerce entry points. It's divided into left/center/right compartments.
   Left: Search Input
   Primary element: Full-width search bar labeled "Search product" with a magnifying glass icon (implied by context).
   Integrated micro-feature: "camera and search" button/icon (small ""location icon") adjacent to search.
   Annotation: "Search product " – positions this as an entry point for product discovery,
   Right: Utility Icons (Horizontal Row)
   Notification icon: Standard bag symbol, labeled implicitly as entry to cart view.
7. Primary Navigation (Sub-Header – Tab Bar Below Main Header)
   A horizontal tab strip (~8% height) for core app sections, spanning full width. Labeled "Home Vendors Wallet Message Profile" each with icons – this acts as a main nav for user journeys, blending lifestyle (jewelry) with functional (wallet/messages).

   take a look into this picture you will se the nav-bar is immediatly  below the serch bar and header section![1762334301628](image/homepageprompt/1762334301628.png)
   Tabs (Left-to-Right):
   Home: Default landing; icon implied (house?).
   Vendors, wallets & others" suggests this expands to a sub-bar with wallet icons (payment quick-links?)
   Wallet: Dedicated payments hub—likely integrates digital wallets; ties into "wallets & others" note.
   Message: Chat icon for vendor/customer support or social sharing.
   Profile: User settings/orders; links to "User to cash" flow (see AI section).
   Active State: Underlined or highlighted (inferred from sketch thickness); supports swipe-to-switch.
8. Main Content Area (Scrollable Body – 60-70% Height)
   This is the dynamic feed/core browsing zone, divided into stacked modules for exploration, categorization, and product immersion. Vertical flow: Mart selection → Send pacage→ Explore/Brands → Featured → Categories → Product Feed.
   Mart Selection Module (Horizontal Dual-Button Strip)
   Labeled "Local Mart | International Mart".
   Two equal-width buttons (rectangles) side-by-side, separated by vertical line.
   Purpose: Vendor ecosystem toggle—local for hyperlocal goods (e.g., neighborhood stores), international for global products shipping.
   Annotation: No icons specified, but recommend globe/local pin for visual distinction.
   Behavior: Tap switches content below (e.g., filters products by origin); default to local?
   Logistics Module (Adjacent Dual-Button Strip)
   Labeled "Send Package".

   Placement: Below marts, suggesting post-selection refinement (e.g., "Local Mart → Send Package").
   Micro-Detail: No toggles shown, but arrows in sketch imply sequential flow.
   Explore Module (Icon Grid Leading to Browse)
   Horizontal row of 6 icons: "Explore [Store/vendors logo] [Store/vendors logo] [Store/vendors logo] [Store/vendors logo] [Store/vendors logo] [Store/vendors logo] => Stores Browse".

   Icons:usec "Logo" placeholders (brand avatars) or shop icons.
   Flow: Arrow "=>" points to "Stores Browse"—tapping icons filters/redirects to store directories (Vendors/stores pages).
   Annotation: Emphasizes multi-vendor discovery; "Stores Browse" as a right-aligned call-to-action button or expandable section.
   Layout: Compact carousel? Sketch shows linear row—recommend horizontal scroll for overflow.
   Brand Module (Logo Carousel Below Explore)
   Single row: "vendor/store [logo]" with one explicit square placeholder, but context implies multiples (tied to explore logos).
   Purpose: Sponsored/partner brands; horizontal scroller for quick jumps.
   Micro-Detail: No count specified—aim for 4-6 logos, with tap-to-view collections.

   as you can see EXPLORE SECTION in the picture below, its appeare in one line but continues horizontal scroller
9. ![1762334492053](image/homepageprompt/1762334492053.png)
   Featured Products Module (Hero Banner or Grid)
10. Labeled Featured products"
    Rectangular banner spanning width, likely a carousel or static promo.
    Tie-in: Personalized via AI (see below); positions high-visibility for upsell.
    Category Menu Module (Tabbed Horizontal Strip)
    Labeled "[All] Fashion Electronics Kids Shoes ? [Category menu]".
    Tabs: "All" (default), "Fashion", "Electronics", "Kids", "Shoes" (query mark "?" suggests placeholder or uncertainty—perhaps "Shoes?" as tentative).
    Layout: Equal-width pills, full-width.
    Behavior: Tap filters the feed below; "Category menu" annotation confirms dropdown potential on long-press.
    Micro-Detail: 5+ tabs shown—ensure ellipsis for more (e.g., overflow menu).
    Product Feed Module (Scrollable Grid/Stream)
    Core content: Vertical "Product feed stream" of cards.
    Each Card Structure (Inferred from stacked rectangles):
    Top: "Vendor name" (small text, left-aligned—e.g., "LocalMart Pro").
    Mid-Left: "Low price" badge (prominent, e.g., "$19.99" in bold circle).
    Mid-Right: "North? Price Health Store" (ambiguous handwriting—likely "Low Price | Health Store"; "North?" may be "Note?" or vendor-specific like "North Vendor"). Suggests variant pricing (low/health tiers) or store badges (e.g., "Health" for wellness category).
    Bottom: Product image/title placeholder; "Product feed stream" implies infinite scroll.
    Grid: 1-2 columns (single on mobile); cards ~200x300px.
    Interactions: Tap to PDP (product detail page); swipe for quick view.
11. AI Features Integration
    The sketch explicitly highlights AI as a differentiator, woven into commerce flows for proactive assistance, personalization, and trust-building. These are not siloed but overlaid (e.g., "+" buttons as AI triggers). Key annotations:
    AI Cart +: Positioned near "Add to Cart +" in header/nav. This is an AI-enhanced add-to-cart button—likely suggests bundle upsells (e.g., "Add these 3 for 20% off?") or auto-fills based on past behavior. "+" implies expandable modal with AI rationale (e.g., "Based on your style"). Placement: Floating action button (FAB) or inline in header—recommend subtle glow for AI indication.
    AI Persons Choice: Bottom-placed label "AI persons choice" (likely "AI Person's Choice"—personalized recs).
    Context: Below feed, tied to "All persons choice" (universal vs. personalized toggle?).
    Functionality: AI-curated section—e.g., "Choices for you" carousel of products based on user data (browsing history, demographics). "All persons" as baseline feed; AI filters for relevance.
    Micro-Detail: Integrates with categories (e.g., AI suggests "Shoes for your running profile"). Ethical note: Include opt-out toggle for privacy.
    Implicit AI Ties:
    Q&A in search: Semantic search (e.g., "cute puppy accessories" → filtered results).
    Wallet/Messages: AI chatbots for support (e.g., "User to cash" flow—AI negotiates deals?).
    Recommendations: "Featured products" likely AI-ranked; explore icons could trigger "Similar stores via AI".
    UX Opportunities: Use micro-animations (e.g., AI suggestions fade in); A/B test transparency (e.g., "Why this?").
12. Bottom Navigation & Utility Bar (Persistent Footer – 10-15% Height)
    Thumb-zone focused for quick switches; labeled elements suggest a custom keyboard-like switcher for input modes.
    Left: Voice/Input Shape
    Irregular blob with internal dots/ellipses ("....")—microphone or voice search icon.
    Annotation: "AI persons choice" overlaps here, implying voice-activated personalization (e.g., "Show me choices for running shoes").
    Behavior: Tap for voice-to-text search or AI query.
    Center Bar = Live Voice Waveform
    Replace the static “||||||....” with a fluid, real-time waveform that reacts to voice input.
    What it does: Pulsates gently when idle → swells with your voice → glows while AI thinks → fades on result.
    Feel: Smooth, silky sine waves (like smoke), translucent, soft glow. Futuristic but calm.
    Triggers: Mic on → Listening → Processing → Done/Error.
    UX Win: Turns silent AI wait into emotional feedback — users feel heard.
    Right: Switcher
    Labeled "Keyboard switch"—toggle between standard keyboard, voice, or emoji input.
    Purpose: Enhances search/product entry; "switch" arrow suggests slide-out keyboard variants.
    Overall: Fixed position; haptic feedback on taps recommended. ""
