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
];

// Category definitions for the filter UI
export const categories = [
  { id: "landscape", label: "Landscape", count: 2 },
  { id: "sci-fi", label: "Sci-Fi", count: 2 },
  { id: "fantasy", label: "Fantasy", count: 3 },
  { id: "nature", label: "Nature", count: 2 },
  { id: "product", label: "Product", count: 1 },
  { id: "minimalist", label: "Minimalist", count: 1 },
  { id: "portrait", label: "Portrait", count: 1 },
  { id: "photography", label: "Photography", count: 1 },
  { id: "architecture", label: "Architecture", count: 1 },
  { id: "abstract", label: "Abstract", count: 1 },
  { id: "art", label: "Art", count: 1 },
] as const;
