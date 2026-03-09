export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  created_at: string;
  access_code?: string;
  is_public?: boolean;
  allow_contributions?: boolean;
}

export interface Photo {
  id: string;
  event_id: string;
  image_url: string;
  created_at: string;
  uploaded_by?: string;
}

export interface EventMember {
  id: string;
  event_id: string;
  user_name: string;
  role: 'owner' | 'contributor' | 'viewer';
  joined_at: string;
}
