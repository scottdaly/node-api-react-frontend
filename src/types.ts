export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  password?: string; // Optional, as OAuth users won't have a password
  created_at: string;
  google_id?: string; // For Google OAuth users
  refresh_token?: string; // For storing refresh tokens
  oauth_provider?: "google" | "local"; // To distinguish between OAuth and local users
  last_login?: string; // Optional, to track user activity
};

export type Character = {
  id: string;
  name: string;
  description: string;
  image: string;
  model: string;
  creator_id: number;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  user_id: number;
  character_id: string;
  title: string;
  message_count: number;
  last_message_content: string;
  last_message_role: string;
  created_at: string;
  last_message_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
};
