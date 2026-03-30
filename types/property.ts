export type PropertyType = 'sale' | 'rent';

export interface Agent {
  name: string;
  photo: string;
  rating: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  garage?: number;
  type: PropertyType;
  status?: 'active' | 'pending' | 'sold';
  is_active?: boolean;
  is_new: boolean;
  created_at: string;
  is_featured?: boolean;
  description?: string;
  amenities?: string[];
  lat?: number;
  lng?: number;
  agent?: Agent;
}
