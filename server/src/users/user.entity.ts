export interface User {
  id: string;
  openid: string;
  nickname?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}
