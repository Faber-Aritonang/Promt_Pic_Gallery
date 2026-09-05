// Types matching PRD Section 4 (Database Schema)
// All Firestore timestamps are stored as epoch milliseconds (number).

// Templates
export interface Template {
  id: string;
  title: string;
  category: string[];
  original_prompt: string;
  original_image_url: string;
  original_image_generated_with: string;
  description: string;
  tags: string[];
  created_by: string;
  created_at: number;
  updated_at: number;
  views_count: number;
  favorites_count: number;
  times_used: number;
  rating: number;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  style_tips: string;
  variations_suggested: string[];
}

// User Versions (Custom Prompts)
export interface UserVersion {
  id: string;
  template_id: string;
  user_id: string;
  refinement_steps: RefinementStep[];
  final_prompt: string;
  final_image_url: string;
  final_image_generated_with: string;
  is_public: boolean;
  shared_at?: number;
  created_at: number;
  stats: {
    total_refinements: number;
    conversation_turns: number;
    generation_time: number;
  };
}

export interface RefinementStep {
  turn: number;
  user_message: string;
  ai_response: string;
  updated_prompt: string;
}

// Chat Messages
export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
  current_prompt_at_this_turn: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  template_id: string;
  messages: ChatMessage[];
  created_at: number;
  updated_at: number;
  status: "active" | "completed" | "draft";
}

// Generated Images
export interface GeneratedImage {
  id: string;
  user_version_id: string;
  prompt: string;
  model_used: string;
  model_params: Record<string, unknown>;
  image_url: string;
  image_storage_path: string;
  generation_time_ms: number;
  status: "success" | "failed" | "pending";
  created_at: number;
  metadata: {
    model_response: unknown;
    usage: {
      tokens_used: number;
      cost: number;
    };
  };
}

// User
export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  stats: {
    total_templates_created: number;
    total_versions_created: number;
    total_images_generated: number;
    favorite_count: number;
  };
  created_at: number;
  updated_at: number;
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
