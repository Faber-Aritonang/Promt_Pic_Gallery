// Seed data for prompt templates.
// These are used both for local development (when Firestore is empty)
// and as a reference for the gallery UI.
//
// In production, templates live in Firestore `templates` collection.
// For local dev without Firestore, the API falls back to this data.

import type { Template } from "@/lib/types";

const now = Date.now();
const day = 86_400_000;

export const seedTemplates: Template[] = [
  // ── Original 8 ────────────────────────────────────────────────────────────
  {
    id: "tpl-001",
    title: "Cyberpunk City at Night",
    category: ["landscape", "sci-fi"],
    original_prompt:
      "A sprawling cyberpunk cityscape at night, neon signs reflecting off rain-slicked streets, towering skyscrapers with holographic advertisements, flying cars in the distance, volumetric fog, cinematic lighting, ultra-detailed, 8k",
    original_image_url:
      "https://images.unsplash.com/photo-1515630771497-75885b0e4b9d?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "A moody, atmospheric cyberpunk cityscape with neon lighting and rain effects. Perfect for sci-fi concept art or book covers.",
    tags: ["cyberpunk", "neon", "city", "night", "rain", "sci-fi", "cinematic"],
    created_by: "admin",
    created_at: now - 7 * day,
    updated_at: now - 7 * day,
    views_count: 1240,
    favorites_count: 89,
    times_used: 234,
    rating: 4.7,
    difficulty_level: "beginner",
    style_tips:
      "Add specific neon colors (pink, cyan, purple) for more vivid results. Use 'volumetric fog' and 'ray tracing' for realism.",
    variations_suggested: [
      "Replace 'night' with 'dawn' for a different mood",
      "Add 'in the style of Blade Runner' for a specific aesthetic",
      "Change 'flying cars' to 'hovering drones' for a grittier feel",
    ],
  },
  {
    id: "tpl-002",
    title: "Enchanted Forest Portal",
    category: ["fantasy", "nature"],
    original_prompt:
      "An ancient enchanted forest with a glowing magical portal between two massive oak trees, fireflies dancing in the air, mushrooms glowing softly on the forest floor, mystical atmosphere, fantasy art style, detailed foliage, ethereal light rays filtering through the canopy",
    original_image_url:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
    original_image_generated_with: "Stable Diffusion XL",
    description:
      "A magical fantasy scene with a glowing portal in an ancient forest. Great for game assets, book illustrations, or wallpaper.",
    tags: ["fantasy", "forest", "portal", "magic", "enchanted", "nature", "ethereal"],
    created_by: "admin",
    created_at: now - 5 * day,
    updated_at: now - 3 * day,
    views_count: 890,
    favorites_count: 112,
    times_used: 178,
    rating: 4.8,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'Unreal Engine 5' or 'octane render' for photorealistic results. Add 'concept art by Greg Rutkowski' for a painterly style.",
    variations_suggested: [
      "Change 'oak trees' to 'cherry blossoms' for an Asian-inspired portal",
      "Add 'a figure stepping through' for narrative tension",
      "Replace 'fireflies' with 'will-o-wisps' for a spookier feel",
    ],
  },
  {
    id: "tpl-003",
    title: "Minimalist Product Shot",
    category: ["product", "minimalist"],
    original_prompt:
      "A sleek matte-black wireless headphone floating on a pure white background, soft studio lighting from the top-left, subtle shadow, product photography, minimalist composition, high-end commercial style, 4k",
    original_image_url:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Clean, professional product photography style. Perfect for e-commerce, marketing materials, or portfolio mockups.",
    tags: ["product", "minimalist", "studio", "commercial", "clean", "professional"],
    created_by: "admin",
    created_at: now - 4 * day,
    updated_at: now - 4 * day,
    views_count: 670,
    favorites_count: 56,
    times_used: 145,
    rating: 4.5,
    difficulty_level: "beginner",
    style_tips:
      "Keep backgrounds clean and uncluttered. Use 'studio lighting' and 'softbox' for professional results. 'Matte finish' reduces unwanted reflections.",
    variations_suggested: [
      "Replace 'headphone' with any product (watch, bottle, phone)",
      "Change 'white background' to 'gradient gray' for depth",
      "Add 'with water droplets' for a premium feel",
    ],
  },
  {
    id: "tpl-004",
    title: "Japanese Zen Garden",
    category: ["nature", "architecture"],
    original_prompt:
      "A serene Japanese zen garden with carefully raked white sand patterns, moss-covered rocks, a small wooden bridge over a koi pond, cherry blossom trees in full bloom, morning mist, soft golden hour lighting, peaceful atmosphere, photorealistic, 8k resolution",
    original_image_url:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "A peaceful Japanese zen garden scene. Ideal for meditation apps, wallpapers, or interior design visualization.",
    tags: ["zen", "japanese", "garden", "cherry-blossom", "peaceful", "nature", "photorealistic"],
    created_by: "admin",
    created_at: now - 3 * day,
    updated_at: now - 2 * day,
    views_count: 560,
    favorites_count: 78,
    times_used: 123,
    rating: 4.6,
    difficulty_level: "beginner",
    style_tips:
      "Add 'golden hour' or 'blue hour' for atmospheric lighting. Use 'tilt-shift' for a miniature effect. 'Film grain' adds a nostalgic quality.",
    variations_suggested: [
      "Change 'morning mist' to 'autumn rain' for a different season",
      "Replace 'koi pond' with 'bamboo fountain' for authenticity",
      "Add 'a geisha walking' for a narrative element",
    ],
  },
  {
    id: "tpl-005",
    title: "Steampunk Airship",
    category: ["sci-fi", "fantasy"],
    original_prompt:
      "A massive Victorian-era steampunk airship with brass gears, copper pipes, and billowing steam, floating above a sprawling industrial cityscape, gear-driven mechanisms visible, clockwork details, warm sepia tones, dramatic clouds, concept art style, detailed illustration",
    original_image_url:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800",
    original_image_generated_with: "Stable Diffusion XL",
    description:
      "A detailed steampunk airship scene with Victorian aesthetics. Great for game concepts, book covers, or alternative history projects.",
    tags: ["steampunk", "airship", "victorian", "brass", "gears", "fantasy", "concept-art"],
    created_by: "admin",
    created_at: now - 2 * day,
    updated_at: now - 1 * day,
    views_count: 430,
    favorites_count: 67,
    times_used: 98,
    rating: 4.4,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'by Ian Miller' or 'by Keith Thompson' for authentic steampunk illustration style. 'Copper and brass' adds warmth. 'Steam and gears' are essential keywords.",
    variations_suggested: [
      "Add 'a captain on the deck' for scale and story",
      "Change 'sepia tones' to 'vibrant sunset' for drama",
      "Replace 'industrial city' with 'floating islands' for a fantasy twist",
    ],
  },
  {
    id: "tpl-006",
    title: "Portrait with Bokeh",
    category: ["portrait", "photography"],
    original_prompt:
      "A close-up portrait of a young woman with freckles, soft natural lighting from a window, shallow depth of field with beautiful circular bokeh in the background, warm color palette, film photography aesthetic, shot on 85mm f/1.4 lens, natural skin texture, candid expression",
    original_image_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Natural, warm portrait photography style with beautiful bokeh. Perfect for avatar generation, profile pictures, or portrait practice.",
    tags: ["portrait", "bokeh", "natural-light", "film", "photography", "candid", "warm"],
    created_by: "admin",
    created_at: now - 1 * day,
    updated_at: now - 1 * day,
    views_count: 780,
    favorites_count: 134,
    times_used: 210,
    rating: 4.9,
    difficulty_level: "advanced",
    style_tips:
      "Specify lens focal length (85mm, 50mm) for realistic depth of field. 'Film grain' and 'Kodak Portra 400' add analog warmth. Avoid 'perfect skin' to keep it natural.",
    variations_suggested: [
      "Change 'freckles' to 'dimples' or 'fierce eyes' for different character",
      "Replace 'window light' with 'golden hour backlight' for rim lighting",
      "Add 'wearing a knit sweater' for a cozy feel",
    ],
  },
  {
    id: "tpl-007",
    title: "Abstract Fluid Art",
    category: ["abstract", "art"],
    original_prompt:
      "Abstract fluid art with vibrant swirling colors, deep ocean blue merging with molten gold and magenta, organic flowing shapes, marbled texture, high contrast, digital painting, 4k wallpaper, mesmerizing patterns, liquid marble effect",
    original_image_url:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Mesmerizing abstract fluid art with rich color blending. Ideal for wallpapers, backgrounds, or artistic inspiration.",
    tags: ["abstract", "fluid", "marble", "colorful", "digital-art", "wallpaper", "organic"],
    created_by: "admin",
    created_at: now - 6 * day,
    updated_at: now - 4 * day,
    views_count: 920,
    favorites_count: 98,
    times_used: 167,
    rating: 4.3,
    difficulty_level: "beginner",
    style_tips:
      "Use specific color pairs (blue+gold, red+teal) for striking contrast. 'Liquid marble' and 'fluid dynamics' create organic flows. 'HDR' enhances vibrancy.",
    variations_suggested: [
      "Replace colors with 'aurora borealis palette' for a northern lights feel",
      "Add 'with metallic silver accents' for a luxury look",
      "Change to 'monochrome blue' for a calmer version",
    ],
  },
  {
    id: "tpl-008",
    title: "Underwater Ruins",
    category: ["fantasy", "landscape"],
    original_prompt:
      "Ancient sunken temple ruins underwater, covered in coral and sea anemones, shafts of sunlight penetrating the deep blue water, tropical fish swimming through broken columns, bioluminescent creatures, mystical underwater atmosphere, detailed fantasy illustration, epic scale",
    original_image_url:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    original_image_generated_with: "Stable Diffusion XL",
    description:
      "A mysterious underwater scene with ancient ruins and marine life. Great for game environments, book illustrations, or fantasy projects.",
    tags: ["underwater", "ruins", "temple", "ocean", "coral", "fantasy", "mystical"],
    created_by: "admin",
    created_at: now - 5 * day,
    updated_at: now - 3 * day,
    views_count: 650,
    favorites_count: 87,
    times_used: 134,
    rating: 4.6,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'caustic lighting' for realistic underwater light patterns. 'God rays' add depth. 'Subsurface scattering' makes water feel translucent.",
    variations_suggested: [
      "Add 'a diver exploring' for human scale and adventure",
      "Change 'tropical fish' to 'giant sea turtles' for majesty",
      "Replace 'sunlight' with 'bioluminescent glow' for a deep-sea version",
    ],
  },

  // ── New templates (Phase 2 expansion) ─────────────────────────────────────

  {
    id: "tpl-009",
    title: "Gourmet Burger Stack",
    category: ["food", "photography"],
    original_prompt:
      "A towering gourmet cheeseburger with melted cheddar, crispy bacon, fresh lettuce, tomato, and special sauce, sesame seed bun, rustic wooden board, steam rising, shallow depth of field, warm moody lighting, food photography, editorial style, mouth-watering detail",
    original_image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Professional food photography style for burgers and comfort food. Perfect for restaurant menus, food blogs, or advertising.",
    tags: ["food", "burger", "gourmet", "food-photography", "editorial", "warm", "appetizing"],
    created_by: "admin",
    created_at: now - 10 * day,
    updated_at: now - 10 * day,
    views_count: 1050,
    favorites_count: 92,
    times_used: 189,
    rating: 4.6,
    difficulty_level: "beginner",
    style_tips:
      "Use 'steam rising' and 'shallow depth of field' for appetizing results. 'Warm lighting' and 'rustic props' (wood, cast iron) add authenticity. Avoid overhead shots for stacked foods.",
    variations_suggested: [
      "Replace 'burger' with 'pizza' for Italian food photography",
      "Change 'wooden board' to 'marble slab' for a modern look",
      "Add 'crumbs and sauce drips' for a messy, indulgent feel",
    ],
  },
  {
    id: "tpl-010",
    title: "Majestic Lion Portrait",
    category: ["animal", "portrait"],
    original_prompt:
      "A majestic male lion with a full golden mane, close-up portrait, intense amber eyes staring directly at camera, warm savanna sunset in the background, golden hour rim lighting, shallow depth of field, wildlife photography, National Geographic style, ultra-sharp detail",
    original_image_url:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Stunning wildlife portrait photography. Ideal for nature documentaries, conservation campaigns, or animal-themed art.",
    tags: ["animal", "lion", "wildlife", "portrait", "savanna", "golden-hour", "nature"],
    created_by: "admin",
    created_at: now - 9 * day,
    updated_at: now - 9 * day,
    views_count: 1380,
    favorites_count: 156,
    times_used: 245,
    rating: 4.9,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'rim lighting' and 'golden hour' for dramatic animal portraits. 'Sharp focus on eyes' is critical. 'National Geographic style' adds documentary quality.",
    variations_suggested: [
      "Replace 'lion' with 'wolf', 'eagle', or 'elephant' for different wildlife",
      "Change 'sunset' to 'misty morning' for a mysterious mood",
      "Add 'cub beside the lion' for a family narrative",
    ],
  },
  {
    id: "tpl-011",
    title: "Nebula Deep Space",
    category: ["space", "abstract"],
    original_prompt:
      "A breathtaking deep space nebula with swirling clouds of purple, blue, and pink gas, thousands of stars scattered across the void, a distant galaxy visible in the background, cosmic dust lanes, Hubble Space Telescope style, ultra-high resolution, astrophotography, vivid colors",
    original_image_url:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
    original_image_generated_with: "Stable Diffusion XL",
    description:
      "Stunning space imagery inspired by Hubble and James Webb telescopes. Perfect for science communication, wallpapers, or sci-fi projects.",
    tags: ["space", "nebula", "stars", "galaxy", "cosmic", "astrophotography", "hubble"],
    created_by: "admin",
    created_at: now - 8 * day,
    updated_at: now - 8 * day,
    views_count: 1120,
    favorites_count: 143,
    times_used: 198,
    rating: 4.8,
    difficulty_level: "beginner",
    style_tips:
      "Use 'Hubble Space Telescope' or 'James Webb' for authentic space imagery. 'Vivid colors' and 'ultra-high resolution' enhance cosmic drama. 'Astrophotography' keeps it realistic.",
    variations_suggested: [
      "Add 'a lone astronaut floating' for human scale",
      "Change 'nebula' to 'black hole with accretion disk' for drama",
      "Replace 'purple and blue' with 'fiery orange and red' for a supernova",
    ],
  },
  {
    id: "tpl-012",
    title: "Haunted Victorian Mansion",
    category: ["horror", "architecture"],
    original_prompt:
      "A decrepit Victorian mansion on a hilltop during a thunderstorm, lightning illuminating broken windows, overgrown dead vines crawling up the walls, fog rolling through the iron gate, crows perched on the roof, dark gothic horror atmosphere, dramatic lighting, Tim Burton inspired, highly detailed illustration",
    original_image_url:
      "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=800",
    original_image_generated_with: "Stable Diffusion XL",
    description:
      "Eerie gothic horror scene perfect for book covers, game assets, Halloween themes, or horror-themed projects.",
    tags: ["horror", "haunted", "mansion", "gothic", "dark", "thunderstorm", "victorian"],
    created_by: "admin",
    created_at: now - 11 * day,
    updated_at: now - 11 * day,
    views_count: 870,
    favorites_count: 108,
    times_used: 167,
    rating: 4.5,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'Tim Burton' or 'Edward Gorey' for stylized horror. 'Dramatic lighting' and 'fog' are essential. 'Thunderstorm' adds dynamic energy. 'Dark muted palette' sets the mood.",
    variations_suggested: [
      "Replace 'mansion' with 'lighthouse' for isolated horror",
      "Change 'thunderstorm' to 'full moon night' for classic gothic",
      "Add 'a ghostly figure in the window' for a jump scare element",
    ],
  },
  {
    id: "tpl-013",
    title: "Anime Warrior Girl",
    category: ["anime", "character"],
    original_prompt:
      "A fierce anime warrior girl with flowing silver hair, glowing blue eyes, wearing ornate samurai armor with intricate engravings, katana drawn, standing on a cliff edge overlooking a vast battlefield at dawn, cherry blossom petals falling, dramatic wind, anime art style, vibrant colors, detailed illustration",
    original_image_url:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Dynamic anime character illustration with action pose and atmospheric background. Great for character design, fan art, or game assets.",
    tags: ["anime", "warrior", "samurai", "character", "fantasy", "action", "illustration"],
    created_by: "admin",
    created_at: now - 12 * day,
    updated_at: now - 12 * day,
    views_count: 1560,
    favorites_count: 178,
    times_used: 289,
    rating: 4.7,
    difficulty_level: "advanced",
    style_tips:
      "Use 'anime art style' and 'vibrant colors' for authentic look. 'Detailed illustration' and 'dynamic pose' add energy. 'Cherry blossom petals' add movement and beauty.",
    variations_suggested: [
      "Replace 'samurai armor' with 'mage robes' for a fantasy twist",
      "Change 'dawn' to 'rainy night' for a darker mood",
      "Add 'magic spells swirling' for a supernatural element",
    ],
  },
  {
    id: "tpl-014",
    title: "Watercolor Cityscape",
    category: ["watercolor", "landscape"],
    original_prompt:
      "A dreamy watercolor painting of a European cityscape with terracotta rooftops, a winding river with stone bridges, distant church spires, soft pastel sky at golden hour, visible brushstrokes, paint drips and splatters, traditional watercolor texture, artistic and loose style, warm Mediterranean palette",
    original_image_url:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Beautiful watercolor painting style for cityscapes. Perfect for art prints, travel posters, or illustration projects.",
    tags: ["watercolor", "cityscape", "european", "painting", "artistic", "loose", "pastel"],
    created_by: "admin",
    created_at: now - 13 * day,
    updated_at: now - 13 * day,
    views_count: 780,
    favorites_count: 112,
    times_used: 156,
    rating: 4.7,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'watercolor' and 'visible brushstrokes' for authentic painted look. 'Paint drips and splatters' add handmade quality. 'Loose style' prevents over-rendering.",
    variations_suggested: [
      "Replace 'European cityscape' with 'Japanese temple' for Asian watercolor",
      "Change 'golden hour' to 'blue hour' for cooler tones",
      "Add 'rain drops on the paper' for a wet-on-wet effect",
    ],
  },
  {
    id: "tpl-015",
    title: "3D Isometric Room",
    category: ["3d-render", "interior"],
    original_prompt:
      "A cozy isometric bedroom rendered in 3D with soft pastel colors, a bed with rumpled blankets, a desk with a glowing laptop, potted plants on the windowsill, warm desk lamp light, small cat sleeping on the bed, miniature diorama style, clean low-poly aesthetic, soft shadows, Blender render",
    original_image_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Charming 3D isometric room scene. Perfect for game assets, illustration projects, or cozy aesthetic content.",
    tags: ["3d", "isometric", "room", "cozy", "miniature", "low-poly", "blender"],
    created_by: "admin",
    created_at: now - 14 * day,
    updated_at: now - 14 * day,
    views_count: 940,
    favorites_count: 134,
    times_used: 201,
    rating: 4.6,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'isometric view' and 'low-poly' for clean 3D style. 'Soft pastel colors' and 'warm lighting' create coziness. 'Blender render' or 'Cinema 4D' for software-specific results.",
    variations_suggested: [
      "Replace 'bedroom' with 'coffee shop' for a different scene",
      "Add 'rain visible through window' for cozy atmosphere",
      "Change 'cat' to 'small dog' or 'hanging plants' for variety",
    ],
  },
  {
    id: "tpl-016",
    title: "Retro Comic Book Hero",
    category: ["comic", "character"],
    original_prompt:
      "A retro 1960s comic book style superhero landing in a dramatic pose, bold black outlines, halftone dot shading, bright primary colors (red, blue, yellow), action lines radiating outward, cityscape background, 'POW!' sound effect, vintage comic book texture, Ben-Day dots, pop art style",
    original_image_url:
      "https://images.unsplash.com/photo-1612036782180-9f0b64a50a86?w=800",
    original_image_generated_with: "Stable Diffusion XL",
    description:
      "Classic retro comic book art style with bold lines and vibrant colors. Great for posters, merchandise, or pop art projects.",
    tags: ["comic", "retro", "superhero", "pop-art", "vintage", "bold", "halftone"],
    created_by: "admin",
    created_at: now - 15 * day,
    updated_at: now - 15 * day,
    views_count: 1020,
    favorites_count: 119,
    times_used: 176,
    rating: 4.5,
    difficulty_level: "beginner",
    style_tips:
      "Use 'Ben-Day dots', 'halftone shading', and 'bold black outlines' for authentic comic look. 'Pop art style' and 'primary colors' enhance the retro feel.",
    variations_suggested: [
      "Replace 'superhero' with 'villain' for an antagonist pose",
      "Change 'cityscape' to 'space station' for sci-fi comics",
      "Add 'thought bubble with text' for narrative element",
    ],
  },
  {
    id: "tpl-017",
    title: "Snowy Mountain Lodge",
    category: ["landscape", "architecture"],
    original_prompt:
      "A cozy wooden mountain lodge nestled in a snowy alpine valley, warm golden light glowing from windows, smoke rising from the chimney, pine trees covered in fresh snow, majestic mountain peaks in the background, clear starry night sky, peaceful winter scene, photorealistic, 8k resolution",
    original_image_url:
      "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "A peaceful winter mountain scene with a cozy lodge. Perfect for holiday cards, travel content, or ambient wallpapers.",
    tags: ["mountain", "winter", "lodge", "snow", "cozy", "alpine", "night"],
    created_by: "admin",
    created_at: now - 16 * day,
    updated_at: now - 16 * day,
    views_count: 890,
    favorites_count: 101,
    times_used: 154,
    rating: 4.7,
    difficulty_level: "beginner",
    style_tips:
      "Use 'warm golden light' contrasting with 'cool blue snow' for dramatic effect. 'Starry night sky' adds magic. 'Chimney smoke' suggests warmth and life inside.",
    variations_suggested: [
      "Change 'night' to 'sunset' for warmer overall tones",
      "Replace 'mountain lodge' with 'treehouse' for a different setting",
      "Add 'Northern Lights' for a magical winter sky",
    ],
  },
  {
    id: "tpl-018",
    title: "Elegant Perfume Bottle",
    category: ["product", "luxury"],
    original_prompt:
      "An elegant crystal perfume bottle with golden accents on a reflective black surface, dramatic side lighting creating long shadows, small perfume mist in the air, luxury brand aesthetic, high-end product photography, studio lighting, clean composition, opulent and sophisticated mood, 8k commercial quality",
    original_image_url:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Luxury product photography for high-end cosmetics and perfumes. Perfect for brand campaigns, e-commerce, or editorial spreads.",
    tags: ["product", "perfume", "luxury", "elegant", "studio", "commercial", "high-end"],
    created_by: "admin",
    created_at: now - 17 * day,
    updated_at: now - 17 * day,
    views_count: 620,
    favorites_count: 67,
    times_used: 112,
    rating: 4.4,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'dramatic side lighting' and 'reflective surface' for luxury feel. 'Clean composition' keeps focus on product. 'Mist' adds ethereal quality.",
    variations_suggested: [
      "Replace 'perfume bottle' with 'jewelry' or 'watch' for other luxury items",
      "Change 'black surface' to 'marble' for a different luxury aesthetic",
      "Add 'flower petals' for a romantic touch",
    ],
  },
  {
    id: "tpl-019",
    title: "Tropical Smoothie Bowl",
    category: ["food", "minimalist"],
    original_prompt:
      "A vibrant tropical smoothie bowl topped with fresh sliced mango, kiwi, passion fruit, coconut flakes, and chia seeds arranged in a beautiful pattern, turquoise ceramic bowl, white marble countertop, overhead shot, bright natural lighting, clean and fresh aesthetic, food styling, minimalist composition",
    original_image_url:
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Clean, bright food photography for healthy bowls and breakfast items. Perfect for health brands, Instagram, or recipe blogs.",
    tags: ["food", "smoothie", "healthy", "tropical", "minimalist", "overhead", "fresh"],
    created_by: "admin",
    created_at: now - 18 * day,
    updated_at: now - 18 * day,
    views_count: 950,
    favorites_count: 128,
    times_used: 210,
    rating: 4.6,
    difficulty_level: "beginner",
    style_tips:
      "Use 'overhead shot' and 'bright natural lighting' for clean food photos. 'Arrange toppings in a pattern' for visual appeal. 'White marble' background keeps it minimal.",
    variations_suggested: [
      "Replace 'smoothie bowl' with 'poke bowl' for savory food",
      "Change 'turquoise bowl' to 'wooden bowl' for rustic feel",
      "Add 'a spoon resting on the side' for a natural, ready-to-eat look",
    ],
  },
  {
    id: "tpl-020",
    title: "Cyberpunk Samurai",
    category: ["character", "sci-fi"],
    original_prompt:
      "A cyberpunk samurai warrior standing in a neon-lit alley, wearing a mix of traditional Japanese armor and futuristic tech implants, glowing LED accents on the armor, holding a glowing plasma katana, rain falling, holographic advertisements in Japanese kanji in the background, moody cinematic lighting, ultra-detailed character design",
    original_image_url:
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "A fusion of traditional samurai aesthetics with cyberpunk technology. Great for game character concepts, album covers, or sci-fi art.",
    tags: ["cyberpunk", "samurai", "neon", "character", "sci-fi", "fusion", "cinematic"],
    created_by: "admin",
    created_at: now - 19 * day,
    updated_at: now - 19 * day,
    views_count: 1340,
    favorites_count: 167,
    times_used: 256,
    rating: 4.8,
    difficulty_level: "advanced",
    style_tips:
      "Use 'traditional Japanese armor' combined with 'futuristic tech' for the fusion aesthetic. 'Neon accents' and 'rain' are essential cyberpunk elements. 'Cinematic lighting' adds drama.",
    variations_suggested: [
      "Replace 'samurai' with 'ninja' for stealthier vibe",
      "Change 'alley' to 'rooftop' for a more epic setting",
      "Add 'cherry blossoms mixed with neon' for poetic contrast",
    ],
  },
];

// Category definitions for the filter UI (auto-calculated counts)
function computeCategories(): { id: string; label: string; count: number }[] {
  const map = new Map<string, { label: string; count: number }>();
  for (const t of seedTemplates) {
    for (const cat of t.category) {
      const existing = map.get(cat);
      if (existing) {
        existing.count++;
      } else {
        map.set(cat, {
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          count: 1,
        });
      }
    }
  }
  return Array.from(map.entries())
    .map(([id, { label, count }]) => ({ id, label, count }))
    .sort((a, b) => b.count - a.count);
}

export const categories = computeCategories();
