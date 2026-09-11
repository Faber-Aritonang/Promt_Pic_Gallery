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
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800",
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

  // ── Phase 2 expansion ────────────────────────────────────────────────────

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
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
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

  // ── Phase 3 expansion (30 new templates) ──────────────────────────────────

  {
    id: "tpl-021",
    title: "Foggy Forest Morning",
    category: ["nature", "landscape"],
    original_prompt:
      "A mystical foggy forest at dawn, tall pine trees disappearing into thick mist, soft golden light filtering through the canopy, moss-covered ground, ferns and wildflowers, ethereal atmosphere, photorealistic, peaceful and serene mood, 8k resolution",
    original_image_url:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Dreamy foggy forest scene with soft morning light. Perfect for meditation apps, nature wallpapers, or book covers.",
    tags: ["forest", "fog", "morning", "nature", "peaceful", "ethereal", "pine"],
    created_by: "admin",
    created_at: now - 20 * day,
    updated_at: now - 20 * day,
    views_count: 820,
    favorites_count: 95,
    times_used: 167,
    rating: 4.7,
    difficulty_level: "beginner",
    style_tips:
      "Use 'volumetric fog' and 'god rays' for atmospheric depth. 'Golden hour' lighting adds warmth to the mist. 'Soft focus' enhances the dreamy quality.",
    variations_suggested: [
      "Change 'pine trees' to 'bamboo forest' for an Asian feel",
      "Replace 'dawn' with 'twilight' for a moodier atmosphere",
      "Add 'a winding path' for a sense of journey and exploration",
    ],
  },
  {
    id: "tpl-022",
    title: "Tropical Beach Sunset",
    category: ["landscape", "nature"],
    original_prompt:
      "A pristine tropical beach at sunset, crystal-clear turquoise water lapping against white sand, silhouettes of palm trees swaying in the breeze, vibrant orange and purple sky reflecting on the calm ocean, golden hour lighting, paradise atmosphere, photorealistic, travel photography style",
    original_image_url:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Paradise tropical beach scene with stunning sunset colors. Ideal for travel content, relaxation apps, or vacation marketing.",
    tags: ["beach", "sunset", "tropical", "ocean", "paradise", "palm", "golden-hour"],
    created_by: "admin",
    created_at: now - 20 * day,
    updated_at: now - 20 * day,
    views_count: 1100,
    favorites_count: 134,
    times_used: 223,
    rating: 4.8,
    difficulty_level: "beginner",
    style_tips:
      "Use 'golden hour' and 'reflections on water' for stunning sunset shots. 'Silhouette of palm trees' adds tropical character. 'Long exposure' smooths the water.",
    variations_suggested: [
      "Replace 'sunset' with 'sunrise' for a calmer, cooler palette",
      "Add 'a sailboat on the horizon' for scale and adventure",
      "Change 'white sand' to 'volcanic black sand' for a dramatic contrast",
    ],
  },
  {
    id: "tpl-023",
    title: "Cute Cat Portrait",
    category: ["animal", "portrait"],
    original_prompt:
      "An adorable fluffy kitten with big bright green eyes, sitting on a cozy knitted blanket, soft warm window light, shallow depth of field, bokeh background, cute and heartwarming expression, detailed fur texture, pet photography, professional quality",
    original_image_url:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Cute and heartwarming pet portrait photography. Perfect for social media content, pet brands, or animal-themed merchandise.",
    tags: ["cat", "kitten", "pet", "portrait", "cute", "cozy", "animal"],
    created_by: "admin",
    created_at: now - 21 * day,
    updated_at: now - 21 * day,
    views_count: 1450,
    favorites_count: 201,
    times_used: 312,
    rating: 4.9,
    difficulty_level: "beginner",
    style_tips:
      "Focus on the eyes for emotional connection. 'Soft natural light' from a window creates gentle shadows. 'Shallow depth of field' isolates the subject beautifully.",
    variations_suggested: [
      "Replace 'kitten' with 'puppy' or 'rabbit' for different pet",
      "Change 'knitted blanket' to 'sunflower field' for outdoor setting",
      "Add 'a bow tie' for a formal, charming look",
    ],
  },
  {
    id: "tpl-024",
    title: "Ancient Japanese Temple",
    category: ["architecture", "landscape"],
    original_prompt:
      "A grand ancient Japanese Buddhist temple with ornate curved roofs and golden details, surrounded by cherry blossom trees in full bloom, a stone pathway leading to the entrance, morning mist, soft pink and gold color palette, serene atmosphere, photorealistic, ultra-detailed architecture",
    original_image_url:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Magnificent Japanese temple surrounded by cherry blossoms. Perfect for travel posters, cultural projects, or meditation apps.",
    tags: ["japanese", "temple", "architecture", "cherry-blossom", "zen", "cultural", "serene"],
    created_by: "admin",
    created_at: now - 21 * day,
    updated_at: now - 21 * day,
    views_count: 760,
    favorites_count: 89,
    times_used: 145,
    rating: 4.6,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'golden hour' for warm, inviting light on temple architecture. 'Cherry blossoms' add seasonal beauty. 'Leading lines' from pathways draw the eye inward.",
    variations_suggested: [
      "Change 'morning mist' to 'evening lantern light' for a magical night scene",
      "Replace 'cherry blossoms' with 'autumn maple leaves' for fall color",
      "Add 'a monk walking' for a contemplative narrative",
    ],
  },
  {
    id: "tpl-025",
    title: "Mountain Lake Reflection",
    category: ["landscape", "nature"],
    original_prompt:
      "A crystal-clear mountain lake reflecting snow-capped peaks, surrounded by pine forests, perfectly still water creating a mirror reflection, vibrant autumn colors on the shoreline, dramatic cloudy sky, golden hour lighting, landscape photography, epic scale, National Geographic style",
    original_image_url:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Breathtaking mountain lake with perfect reflections. Ideal for landscape photography, travel content, or nature calendars.",
    tags: ["mountain", "lake", "reflection", "landscape", "nature", "photography", "epic"],
    created_by: "admin",
    created_at: now - 22 * day,
    updated_at: now - 22 * day,
    views_count: 980,
    favorites_count: 112,
    times_used: 187,
    rating: 4.8,
    difficulty_level: "beginner",
    style_tips:
      "Wait for completely still water for perfect reflections. 'Golden hour' or 'blue hour' creates the best colors. 'Wide angle' captures the full scene.",
    variations_suggested: [
      "Replace 'autumn colors' with 'snow-covered shore' for winter",
      "Add 'a lone canoe' for scale and human element",
      "Change 'cloudy sky' to 'aurora borealis' for a magical northern scene",
    ],
  },
  {
    id: "tpl-026",
    title: "Fresh Pasta Making",
    category: ["food", "photography"],
    original_prompt:
      "A rustic Italian kitchen scene with fresh handmade pasta being rolled out on a wooden table, flour dusted surface, hands working the dough, ingredients like tomatoes and basil nearby, warm natural window light, steam rising from a pot in the background, authentic food photography, editorial style",
    original_image_url:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Authentic Italian cooking scene with fresh pasta. Perfect for recipe blogs, cookbooks, or restaurant marketing.",
    tags: ["food", "pasta", "italian", "cooking", "rustic", "kitchen", "editorial"],
    created_by: "admin",
    created_at: now - 22 * day,
    updated_at: now - 22 * day,
    views_count: 890,
    favorites_count: 98,
    times_used: 178,
    rating: 4.5,
    difficulty_level: "beginner",
    style_tips:
      "Use 'natural window light' for authentic kitchen scenes. 'Hands in frame' adds human element and storytelling. 'Overhead angle' works well for food preparation shots.",
    variations_suggested: [
      "Replace 'pasta' with 'bread baking' for a different Italian dish",
      "Change 'wooden table' to 'marble countertop' for modern kitchen",
      "Add 'fresh herbs hanging' for a more detailed kitchen scene",
    ],
  },
  {
    id: "tpl-027",
    title: "Fashion Portrait Studio",
    category: ["portrait", "fashion"],
    original_prompt:
      "A high-fashion portrait of a confident woman with slicked-back hair, wearing a bold red lipstick and elegant black dress, dramatic studio lighting with strong shadows, clean white background, editorial fashion photography, Vogue magazine style, sharp focus, professional retouching",
    original_image_url:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "High-fashion editorial portrait with dramatic studio lighting. Perfect for fashion brands, magazine covers, or portfolio work.",
    tags: ["fashion", "portrait", "studio", "editorial", "elegant", "vogue", "glamour"],
    created_by: "admin",
    created_at: now - 23 * day,
    updated_at: now - 23 * day,
    views_count: 670,
    favorites_count: 78,
    times_used: 134,
    rating: 4.6,
    difficulty_level: "advanced",
    style_tips:
      "Use 'Rembrandt lighting' or 'split lighting' for dramatic fashion portraits. 'Clean background' keeps focus on the subject. 'High contrast' adds editorial quality.",
    variations_suggested: [
      "Change 'red lipstick' to 'bold blue eyeshadow' for avant-garde look",
      "Replace 'black dress' with 'flowing white gown' for ethereal style",
      "Add 'dramatic jewelry' for luxury editorial feel",
    ],
  },
  {
    id: "tpl-028",
    title: "Minimalist Headshot",
    category: ["portrait", "minimalist"],
    original_prompt:
      "A clean minimalist headshot portrait of a young professional, soft diffused studio lighting, neutral gray background, natural expression, sharp eyes in focus, professional corporate style, high-resolution skin detail, no harsh shadows, modern and approachable look",
    original_image_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Professional minimalist headshot for corporate or social media use. Perfect for LinkedIn profiles, company websites, or personal branding.",
    tags: ["portrait", "headshot", "professional", "minimalist", "corporate", "clean", "modern"],
    created_by: "admin",
    created_at: now - 23 * day,
    updated_at: now - 23 * day,
    views_count: 540,
    favorites_count: 67,
    times_used: 123,
    rating: 4.4,
    difficulty_level: "beginner",
    style_tips:
      "Use 'soft diffused lighting' for flattering skin. 'Neutral background' keeps it professional. 'Catch light in eyes' brings life to the portrait.",
    variations_suggested: [
      "Change 'gray background' to 'white' for a cleaner look",
      "Replace 'neutral expression' with 'warm smile' for approachability",
      "Add 'subtle rim light' to separate subject from background",
    ],
  },
  {
    id: "tpl-029",
    title: "Sunlight Through Leaves",
    category: ["nature", "abstract"],
    original_prompt:
      "Beautiful golden sunlight filtering through green tree leaves, creating dappled light patterns on the forest floor, bokeh light spots, warm summer afternoon atmosphere, lens flare, natural abstract patterns of light and shadow, close-up botanical photography",
    original_image_url:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Dreamy nature photography with sunlight filtering through leaves. Perfect for wellness brands, meditation apps, or nature wallpapers.",
    tags: ["nature", "sunlight", "leaves", "bokeh", "botanical", "warm", "abstract"],
    created_by: "admin",
    created_at: now - 24 * day,
    updated_at: now - 24 * day,
    views_count: 720,
    favorites_count: 89,
    times_used: 156,
    rating: 4.5,
    difficulty_level: "beginner",
    style_tips:
      "Shoot directly into the light for beautiful lens flare and bokeh. 'Backlit leaves' glow with vibrant green. 'Shallow depth of field' creates magical light spots.",
    variations_suggested: [
      "Replace 'green leaves' with 'autumn red leaves' for seasonal warmth",
      "Add 'morning dew drops on leaves' for sparkle",
      "Change 'forest floor' to 'garden path' for a more cultivated feel",
    ],
  },
  {
    id: "tpl-030",
    title: "Futuristic City Skyline",
    category: ["sci-fi", "landscape"],
    original_prompt:
      "A futuristic city skyline at dusk with towering glass skyscrapers, holographic billboards floating in the air, flying vehicles leaving light trails, a massive moon rising behind the buildings, cyberpunk-inspired architecture, neon accents on buildings, cinematic wide shot, concept art style, ultra-detailed",
    original_image_url:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Spectacular futuristic cityscape with sci-fi architecture. Perfect for concept art, game environments, or science fiction book covers.",
    tags: ["futuristic", "city", "skyline", "sci-fi", "cyberpunk", "neon", "concept-art"],
    created_by: "admin",
    created_at: now - 24 * day,
    updated_at: now - 24 * day,
    views_count: 890,
    favorites_count: 112,
    times_used: 189,
    rating: 4.7,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'dramatic sky' and 'moon rising' for epic scale. 'Holographic elements' and 'light trails' add futuristic technology. 'Wide-angle perspective' emphasizes city grandeur.",
    variations_suggested: [
      "Change 'dusk' to 'dawn' for a hopeful, new-world feeling",
      "Replace 'flying vehicles' with 'hovering drones' for grittier dystopia",
      "Add 'a figure on a rooftop' for a lone-hero narrative",
    ],
  },
  {
    id: "tpl-031",
    title: "Retro Neon Signs",
    category: ["photography", "abstract"],
    original_prompt:
      "A collection of vintage neon signs glowing in the dark, retro typography in pink, blue, and yellow neon tubes, reflecting on wet pavement, nostalgic Americana atmosphere, 1950s diner aesthetic, moody night photography, shallow depth of field, warm and cool color contrast",
    original_image_url:
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Nostalgic retro neon sign photography with vibrant colors. Perfect for vintage-themed projects, bar/restaurant branding, or music album covers.",
    tags: ["neon", "retro", "vintage", "signs", "night", "americana", "nostalgic"],
    created_by: "admin",
    created_at: now - 25 * day,
    updated_at: now - 25 * day,
    views_count: 760,
    favorites_count: 87,
    times_used: 145,
    rating: 4.5,
    difficulty_level: "beginner",
    style_tips:
      "Shoot at blue hour for the best neon glow. 'Wet pavement reflections' double the visual impact. 'Shallow depth of field' creates beautiful bokeh from distant lights.",
    variations_suggested: [
      "Focus on a single sign for a minimalist composition",
      "Change '1950s diner' to 'Japanese izakaya' for Asian neon aesthetic",
      "Add 'rain falling through neon light' for atmospheric mood",
    ],
  },
  {
    id: "tpl-032",
    title: "Abstract Color Explosion",
    category: ["abstract", "art"],
    original_prompt:
      "A vibrant explosion of colorful paint powders against a pure white background, Holi festival inspired, vivid reds, yellows, blues, and purples mixing in mid-air, high-speed photography capturing every particle, dynamic energy, ultra-sharp detail, studio lighting, clean composition",
    original_image_url:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Dynamic abstract color explosion with vibrant powder effects. Perfect for creative campaigns, event posters, or artistic backgrounds.",
    tags: ["abstract", "color", "explosion", "powder", "vibrant", "dynamic", "creative"],
    created_by: "admin",
    created_at: now - 25 * day,
    updated_at: now - 25 * day,
    views_count: 680,
    favorites_count: 78,
    times_used: 134,
    rating: 4.4,
    difficulty_level: "beginner",
    style_tips:
      "Use 'high-speed photography' to freeze particles in mid-air. 'White background' makes colors pop. 'Multiple color combinations' create visual excitement.",
    variations_suggested: [
      "Replace 'powder' with 'liquid paint' for fluid splash effects",
      "Change 'white background' to 'black background' for dramatic contrast",
      "Add 'a silhouette figure' for a human element in the chaos",
    ],
  },
  {
    id: "tpl-033",
    title: "Gradient Dream",
    category: ["abstract", "minimalist"],
    original_prompt:
      "A smooth pastel gradient blending from soft lavender to warm peach to gentle mint green, clean and minimal composition, no objects or textures, pure color field, soft transitions, digital art, perfect for backgrounds, wallpapers, or UI design elements, calming and modern aesthetic",
    original_image_url:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Clean pastel gradient background for modern design. Perfect for app backgrounds, social media templates, or minimalist wallpapers.",
    tags: ["gradient", "pastel", "minimalist", "abstract", "background", "modern", "clean"],
    created_by: "admin",
    created_at: now - 26 * day,
    updated_at: now - 26 * day,
    views_count: 540,
    favorites_count: 67,
    times_used: 234,
    rating: 4.3,
    difficulty_level: "beginner",
    style_tips:
      "Use 'soft pastel colors' for a calming effect. 'Smooth transitions' between colors create elegance. 'No distracting elements' keeps it clean for design use.",
    variations_suggested: [
      "Replace pastels with 'vibrant neon colors' for energy",
      "Change 'horizontal gradient' to 'radial gradient' for a spotlight effect",
      "Add 'subtle grain texture' for a more organic, vintage feel",
    ],
  },
  {
    id: "tpl-034",
    title: "Cozy Coding Setup",
    category: ["photography", "interior"],
    original_prompt:
      "A cozy home office coding setup with dual monitors displaying colorful code, mechanical keyboard with RGB backlighting, warm desk lamp, potted plants, coffee mug, ambient warm lighting, clean cable management, modern minimalist desk, productive and inviting atmosphere",
    original_image_url:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Inviting developer workspace with warm ambient lighting. Perfect for tech blogs, coding tutorials, or workspace inspiration.",
    tags: ["workspace", "coding", "desk", "setup", "developer", "cozy", "technology"],
    created_by: "admin",
    created_at: now - 26 * day,
    updated_at: now - 26 * day,
    views_count: 650,
    favorites_count: 78,
    times_used: 123,
    rating: 4.5,
    difficulty_level: "beginner",
    style_tips:
      "Use 'warm ambient lighting' combined with 'cool screen glow' for color contrast. 'Clean desk' with 'personal touches' (plants, mug) adds personality. 'Shallow depth of field' focuses attention.",
    variations_suggested: [
      "Replace 'RGB keyboard' with 'vintage typewriter' for a retro coder vibe",
      "Change 'night setting' to 'morning sunlight' for a fresh feel",
      "Add 'a cat sleeping on the desk' for extra coziness",
    ],
  },
  {
    id: "tpl-035",
    title: "Friendly Robot Companion",
    category: ["sci-fi", "character"],
    original_prompt:
      "A friendly humanoid robot with a sleek white and silver design, expressive LED eyes glowing warm blue, sitting in a garden surrounded by flowers, gentle and approachable expression, soft natural lighting, Pixar-style character design, clean and modern aesthetic, detailed mechanical joints",
    original_image_url:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Adorable robot character in a natural setting. Perfect for animation concepts, children's books, or tech brand mascots.",
    tags: ["robot", "character", "friendly", "sci-fi", "cute", "pixar", "ai"],
    created_by: "admin",
    created_at: now - 27 * day,
    updated_at: now - 27 * day,
    views_count: 870,
    favorites_count: 112,
    times_used: 167,
    rating: 4.6,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'Pixar-style' for a friendly, rounded character design. 'Expressive eyes' are key for emotional connection. 'Natural setting' contrasts with technology.",
    variations_suggested: [
      "Replace 'garden' with 'space station' for a sci-fi environment",
      "Change 'white and silver' to 'rusty and weathered' for a vintage robot",
      "Add 'holding a flower' for a tender, poetic moment",
    ],
  },
  {
    id: "tpl-036",
    title: "Laptop Productivity",
    category: ["product", "photography"],
    original_prompt:
      "A modern laptop on a clean wooden desk, screen showing a vibrant creative application, natural daylight streaming through a window, minimalist workspace with a notebook and pen nearby, professional product photography, soft shadows, warm tones, lifestyle tech photography",
    original_image_url:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Clean lifestyle tech photography for laptop and workspace products. Perfect for tech reviews, e-commerce, or brand campaigns.",
    tags: ["laptop", "workspace", "tech", "product", "minimalist", "lifestyle", "productivity"],
    created_by: "admin",
    created_at: now - 27 * day,
    updated_at: now - 27 * day,
    views_count: 590,
    favorites_count: 67,
    times_used: 112,
    rating: 4.4,
    difficulty_level: "beginner",
    style_tips:
      "Use 'natural window light' for authentic lifestyle feel. 'Clean desk' with 'minimal props' keeps focus on the product. 'Slightly angled' view adds depth.",
    variations_suggested: [
      "Replace 'wooden desk' with 'marble surface' for luxury feel",
      "Change 'daylight' to 'evening lamp light' for cozy atmosphere",
      "Add 'hands on keyboard' for a dynamic, in-use shot",
    ],
  },
  {
    id: "tpl-037",
    title: "Gourmet Breakfast Plate",
    category: ["food", "photography"],
    original_prompt:
      "A beautifully plated gourmet breakfast with perfectly poached eggs, avocado toast, fresh berries, and a drizzle of honey, ceramic plate on a marble surface, bright natural morning light, overhead shot, food styling with herbs as garnish, clean and appetizing composition, Instagram-worthy",
    original_image_url:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Instagram-worthy breakfast photography with perfect plating. Perfect for brunch menus, food bloggers, or healthy eating campaigns.",
    tags: ["food", "breakfast", "brunch", "avocado", "healthy", "overhead", "food-styling"],
    created_by: "admin",
    created_at: now - 28 * day,
    updated_at: now - 28 * day,
    views_count: 920,
    favorites_count: 112,
    times_used: 198,
    rating: 4.7,
    difficulty_level: "beginner",
    style_tips:
      "Use 'overhead shot' and 'bright natural light' for clean food photography. 'Fresh herbs' add color and freshness. 'Negative space' around the plate creates breathing room.",
    variations_suggested: [
      "Replace 'poached eggs' with 'pancakes' for a sweet breakfast",
      "Change 'marble surface' to 'rustic wooden table' for farmhouse feel",
      "Add 'a hand reaching for the plate' for a candid, lifestyle touch",
    ],
  },
  {
    id: "tpl-038",
    title: "Lush Green Valley",
    category: ["landscape", "nature"],
    original_prompt:
      "A breathtaking lush green valley with rolling hills, wildflowers scattered across the meadow, a winding river in the distance, dramatic clouds casting shadows on the landscape, golden afternoon light, vibrant saturated colors, landscape photography, epic wide-angle view",
    original_image_url:
      "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Stunning green valley landscape with vibrant colors. Perfect for travel posters, nature documentaries, or environmental campaigns.",
    tags: ["landscape", "valley", "green", "nature", "meadow", "river", "epic"],
    created_by: "admin",
    created_at: now - 28 * day,
    updated_at: now - 28 * day,
    views_count: 740,
    favorites_count: 89,
    times_used: 156,
    rating: 4.6,
    difficulty_level: "beginner",
    style_tips:
      "Use 'wide-angle lens' for expansive views. 'Dramatic clouds' add depth and interest to skies. 'Golden afternoon light' enhances green saturation.",
    variations_suggested: [
      "Change 'green valley' to 'lavender field' for purple hues",
      "Add 'a solitary tree' as a focal point",
      "Replace 'afternoon' with 'misty morning' for a mysterious atmosphere",
    ],
  },
  {
    id: "tpl-039",
    title: "Morning Coffee Ritual",
    category: ["photography", "minimalist"],
    original_prompt:
      "A steaming cup of black coffee in a handmade ceramic mug on a sunlit windowsill, morning golden light streaming through sheer curtains, a small succulent plant nearby, peaceful and meditative atmosphere, warm tones, shallow depth of field, lifestyle photography, cozy morning vibe",
    original_image_url:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Peaceful morning coffee scene with warm natural light. Perfect for lifestyle brands, coffee shops, or wellness content.",
    tags: ["coffee", "morning", "minimalist", "cozy", "lifestyle", "warm", "peaceful"],
    created_by: "admin",
    created_at: now - 29 * day,
    updated_at: now - 29 * day,
    views_count: 680,
    favorites_count: 78,
    times_used: 145,
    rating: 4.5,
    difficulty_level: "beginner",
    style_tips:
      "Use 'morning window light' for warm, inviting tones. 'Steam rising' from the coffee adds life and warmth. 'Shallow depth of field' creates a dreamy atmosphere.",
    variations_suggested: [
      "Replace 'black coffee' with 'latte art' for a more visual drink",
      "Change 'windowsill' to 'outdoor café table' for a Parisian feel",
      "Add 'an open book' for a contemplative, intellectual mood",
    ],
  },
  {
    id: "tpl-040",
    title: "Musician on Stage",
    category: ["portrait", "photography"],
    original_prompt:
      "A passionate musician performing on stage, electric guitar in hand, dramatic stage lighting with purple and blue spotlights, crowd silhouettes in the foreground, sweat and energy captured mid-performance, concert photography, raw emotion, dynamic composition, high-contrast lighting",
    original_image_url:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Energetic live concert photography capturing the passion of performance. Perfect for music blogs, event promotions, or album artwork.",
    tags: ["musician", "concert", "stage", "performance", "lighting", "energy", "live"],
    created_by: "admin",
    created_at: now - 29 * day,
    updated_at: now - 29 * day,
    views_count: 810,
    favorites_count: 95,
    times_used: 167,
    rating: 4.7,
    difficulty_level: "advanced",
    style_tips:
      "Use 'high ISO' and 'fast shutter speed' to freeze action. 'Dramatic colored lighting' creates atmosphere. 'Low angle' makes the performer look powerful.",
    variations_suggested: [
      "Replace 'electric guitar' with 'drums' or 'microphone' for different instrument",
      "Change 'purple and blue' to 'red and orange' for fiery energy",
      "Add 'confetti falling' for a celebratory finale moment",
    ],
  },
  {
    id: "tpl-041",
    title: "Contemporary Dance",
    category: ["portrait", "art"],
    original_prompt:
      "A contemporary dancer mid-leap in a minimalist white studio, flowing fabric catching the air, dramatic shadows on the floor, graceful and powerful movement captured, artistic black and white with selective color, fine art photography, emotional expression, perfect form",
    original_image_url:
      "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Artistic dance photography capturing movement and emotion. Perfect for performing arts promotions, gallery exhibitions, or creative portfolios.",
    tags: ["dance", "contemporary", "artistic", "movement", "grace", "expression", "fine-art"],
    created_by: "admin",
    created_at: now - 30 * day,
    updated_at: now - 30 * day,
    views_count: 560,
    favorites_count: 67,
    times_used: 98,
    rating: 4.6,
    difficulty_level: "advanced",
    style_tips:
      "Use 'high shutter speed' to freeze motion. 'Dramatic lighting' from the side creates beautiful shadows. 'Flowing fabric' adds visual poetry to movement.",
    variations_suggested: [
      "Change 'white studio' to 'outdoor urban setting' for contrast",
      "Replace 'black and white' with 'vibrant color' for energy",
      "Add 'multiple exposures' for a motion-blur artistic effect",
    ],
  },
  {
    id: "tpl-042",
    title: "Tropical Travel Boat",
    category: ["landscape", "travel"],
    original_prompt:
      "A traditional wooden boat floating on crystal-clear turquoise water, tropical island with lush green vegetation in the background, dramatic mountainous coastline, white sandy beach, bright sunny day with scattered clouds, travel photography, vivid colors, paradise destination",
    original_image_url:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Idyllic tropical travel scene with crystal-clear waters. Perfect for travel agencies, tourism campaigns, or vacation destination marketing.",
    tags: ["travel", "boat", "tropical", "ocean", "island", "paradise", "vacation"],
    created_by: "admin",
    created_at: now - 30 * day,
    updated_at: now - 30 * day,
    views_count: 780,
    favorites_count: 89,
    times_used: 145,
    rating: 4.6,
    difficulty_level: "beginner",
    style_tips:
      "Use 'polarizing filter' to enhance water color and reduce glare. 'Vibrant saturation' makes tropical colors pop. 'Wide angle' captures the full scene.",
    variations_suggested: [
      "Replace 'wooden boat' with 'kayak' for an adventure feel",
      "Change 'sunny day' to 'dramatic storm clouds' for mood",
      "Add 'a snorkeler in the water' for an active scene",
    ],
  },
  {
    id: "tpl-043",
    title: "Night Market Street Food",
    category: ["food", "photography"],
    original_prompt:
      "A bustling Asian night market street food stall, colorful hanging lanterns, steaming wok with vegetables and noodles, vibrant neon signs, crowds of people, warm golden and cool blue lighting contrast, street photography style, authentic and lively atmosphere, rich colors",
    original_image_url:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Authentic Asian night market atmosphere with vibrant street food. Perfect for travel content, food documentaries, or cultural projects.",
    tags: ["food", "night-market", "street-food", "asian", "lanterns", "vibrant", "authentic"],
    created_by: "admin",
    created_at: now - 31 * day,
    updated_at: now - 31 * day,
    views_count: 920,
    favorites_count: 112,
    times_used: 189,
    rating: 4.7,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'mixed lighting' (warm lanterns + cool neon) for color contrast. 'Capture steam' rising from food for freshness. 'Wide aperture' handles low light beautifully.",
    variations_suggested: [
      "Focus on a single dish for 'close-up food photography'",
      "Change 'night market' to 'morning fish market' for a different energy",
      "Add 'rain falling' for atmospheric mood with reflections",
    ],
  },
  {
    id: "tpl-044",
    title: "Digital Matrix Code",
    category: ["sci-fi", "abstract"],
    original_prompt:
      "Streams of green digital code raining down against a dark background, Matrix-inspired digital rain effect, glowing green characters cascading vertically, cyberpunk hacker aesthetic, digital art, futuristic technology concept, high contrast, cinematic atmosphere",
    original_image_url:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    original_image_generated_with: "Stable Diffusion XL",
    description:
      "Iconic digital rain effect inspired by The Matrix. Perfect for tech wallpapers, cybersecurity themes, or sci-fi projects.",
    tags: ["matrix", "digital", "code", "cyberpunk", "hacker", "technology", "sci-fi"],
    created_by: "admin",
    created_at: now - 31 * day,
    updated_at: now - 31 * day,
    views_count: 680,
    favorites_count: 78,
    times_used: 134,
    rating: 4.4,
    difficulty_level: "beginner",
    style_tips:
      "Use 'bright green on black' for the classic Matrix look. 'Vertical text streams' create the rain effect. 'Glow effect' on characters adds depth.",
    variations_suggested: [
      "Change 'green' to 'blue' for a different digital aesthetic",
      "Add 'a silhouette figure' in the foreground for scale",
      "Replace 'characters' with 'binary code' (0s and 1s) for realism",
    ],
  },
  {
    id: "tpl-045",
    title: "Rugged Coastline",
    category: ["landscape", "nature"],
    original_prompt:
      "A dramatic rugged coastline with towering cliff formations, powerful waves crashing against rocky shores, sea spray mist in the air, overcast sky with dramatic clouds, moody atmosphere, long exposure smoothing the water, landscape photography, epic natural beauty",
    original_image_url:
      "https://images.unsplash.com/photo-1540206395-68808572332f?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Dramatic coastal landscape with powerful natural forces. Perfect for nature documentaries, travel content, or dramatic wall art.",
    tags: ["coastline", "cliffs", "ocean", "waves", "dramatic", "landscape", "moody"],
    created_by: "admin",
    created_at: now - 32 * day,
    updated_at: now - 32 * day,
    views_count: 620,
    favorites_count: 78,
    times_used: 123,
    rating: 4.5,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'long exposure' (2-4 seconds) to smooth wave motion. 'Overcast sky' adds dramatic mood. 'Wide angle' captures the full coastal drama.",
    variations_suggested: [
      "Change 'overcast' to 'golden sunset' for warmth and drama",
      "Add 'a lighthouse on the cliff' for a focal point",
      "Replace 'long exposure' with 'fast shutter' to freeze wave spray",
    ],
  },
  {
    id: "tpl-046",
    title: "Male Portrait Study",
    category: ["portrait", "photography"],
    original_prompt:
      "A striking portrait of a man with a well-groomed beard, strong jawline, thoughtful expression, side lighting creating dramatic shadows, dark moody background, shot on 50mm lens, shallow depth of field, black and white with subtle warm tones, editorial portrait photography",
    original_image_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Dramatic editorial portrait with moody lighting. Perfect for magazine features, personal branding, or portrait photography portfolios.",
    tags: ["portrait", "male", "editorial", "dramatic", "moody", "beard", "lighting"],
    created_by: "admin",
    created_at: now - 32 * day,
    updated_at: now - 32 * day,
    views_count: 510,
    favorites_count: 67,
    times_used: 98,
    rating: 4.5,
    difficulty_level: "intermediate",
    style_tips:
      "Use 'Rembrandt lighting' (triangle of light on cheek) for dramatic portraits. 'Dark background' isolates the subject. 'Catch light in eyes' adds life.",
    variations_suggested: [
      "Change 'black and white' to 'warm sepia' for a vintage feel",
      "Replace 'side lighting' with 'backlighting' for rim light effect",
      "Add 'a hat or scarf' for character and texture",
    ],
  },
  {
    id: "tpl-047",
    title: "Misty Mountain Forest",
    category: ["nature", "landscape"],
    original_prompt:
      "Layers of misty mountain ridges fading into the distance, dense pine forest covering the slopes, morning fog filling the valleys, soft diffused light, peaceful and contemplative atmosphere, aerial perspective, landscape photography, muted color palette, zen-like tranquility",
    original_image_url:
      "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Serene misty mountain landscape with layered ridges. Perfect for meditation content, nature wallpapers, or zen-inspired projects.",
    tags: ["mountain", "mist", "forest", "fog", "peaceful", "landscape", "zen"],
    created_by: "admin",
    created_at: now - 33 * day,
    updated_at: now - 33 * day,
    views_count: 590,
    favorites_count: 78,
    times_used: 112,
    rating: 4.6,
    difficulty_level: "beginner",
    style_tips:
      "Shoot at dawn for the best mist layers. 'Telephoto lens' compresses the mountain layers beautifully. 'Muted, desaturated colors' enhance the zen mood.",
    variations_suggested: [
      "Change 'morning' to 'sunset' for warm orange mist",
      "Replace 'pine forest' with 'bamboo forest' for Asian zen aesthetic",
      "Add 'a lone bird flying' for a sense of freedom and scale",
    ],
  },
  {
    id: "tpl-048",
    title: "Elegant Floral Arrangement",
    category: ["product", "photography"],
    original_prompt:
      "An elegant floral arrangement of pink and white peonies with eucalyptus leaves in a minimalist ceramic vase, soft natural window light, clean white marble surface, delicate petals with water droplets, fine art still life photography, romantic and sophisticated mood",
    original_image_url:
      "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Elegant floral still life with soft natural lighting. Perfect for wedding content, home décor brands, or lifestyle photography.",
    tags: ["flowers", "floral", "still-life", "elegant", "romantic", "minimalist", "photography"],
    created_by: "admin",
    created_at: now - 33 * day,
    updated_at: now - 33 * day,
    views_count: 480,
    favorites_count: 56,
    times_used: 89,
    rating: 4.4,
    difficulty_level: "beginner",
    style_tips:
      "Use 'natural window light' for soft, flattering illumination. 'Water droplets' add freshness and detail. 'Clean background' keeps focus on the arrangement.",
    variations_suggested: [
      "Replace 'peonies' with 'sunflowers' for a brighter, bolder look",
      "Change 'ceramic vase' to 'crystal vase' for luxury feel",
      "Add 'falling petals' for a dynamic, romantic moment",
    ],
  },
  {
    id: "tpl-049",
    title: "Vintage Toast Breakfast",
    category: ["food", "photography"],
    original_prompt:
      "A rustic breakfast scene with thick-cut sourdough toast topped with avocado, cherry tomatoes, and microgreens, served on a vintage ceramic plate, wooden farmhouse table, jam jar and butter knife nearby, warm morning light, cozy and inviting food photography, editorial style",
    original_image_url:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800",
    original_image_generated_with: "DALL·E 3",
    description:
      "Rustic breakfast photography with artisan toast. Perfect for café menus, food blogs, or healthy lifestyle content.",
    tags: ["food", "breakfast", "toast", "avocado", "rustic", "morning", "healthy"],
    created_by: "admin",
    created_at: now - 34 * day,
    updated_at: now - 34 * day,
    views_count: 710,
    favorites_count: 89,
    times_used: 156,
    rating: 4.5,
    difficulty_level: "beginner",
    style_tips:
      "Use 'warm morning light' for a cozy atmosphere. 'Rustic props' (wooden table, vintage plate) add character. '45-degree angle' works well for plated food.",
    variations_suggested: [
      "Replace 'avocado' with 'poached eggs and hollandaise' for eggs Benedict",
      "Change 'sourdough' to 'waffles' for a sweet breakfast option",
      "Add 'a glass of fresh juice' for a complete breakfast scene",
    ],
  },
  {
    id: "tpl-050",
    title: "Neon Urban Night",
    category: ["photography", "sci-fi"],
    original_prompt:
      "A narrow urban street at night illuminated by vibrant neon signs in various colors, wet pavement reflecting the lights, moody cyberpunk atmosphere, people walking as silhouettes, rain-slicked surfaces, cinematic street photography, rich color contrast between warm and cool tones",
    original_image_url:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    original_image_generated_with: "Midjourney v6",
    description:
      "Atmospheric neon-lit urban street scene. Perfect for cyberpunk projects, movie posters, or moody editorial photography.",
    tags: ["neon", "urban", "night", "street", "cyberpunk", "rain", "moody"],
    created_by: "admin",
    created_at: now - 34 * day,
    updated_at: now - 34 * day,
    views_count: 850,
    favorites_count: 98,
    times_used: 178,
    rating: 4.7,
    difficulty_level: "intermediate",
    style_tips:
      "Shoot after rain for the best reflections. 'Mixed neon colors' create vibrant contrast. 'Silhouettes of people' add scale and story without distracting from the scene.",
    variations_suggested: [
      "Add 'steam rising from a manhole' for extra atmosphere",
      "Change 'narrow street' to 'rooftop view' for a city panorama",
      "Replace 'rain' with 'snow' for a winter cyberpunk feel",
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
