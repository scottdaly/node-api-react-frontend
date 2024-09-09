export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
};

export type Character = {
  id: number;
  name: string;
  description: string;
  image: string;
  model: string;
  creator_id: number;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: number;
  user_id: number;
  character_id: number;
  title: string;
  message_count: number;
  last_message_content: string;
  last_message_role: string;
  created_at: string;
  last_message_at: string;
};

export type Message = {
  id: number;
  conversation_id: number;
  role: string;
  content: string;
  created_at: string;
};
