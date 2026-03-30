export interface SavedProperty {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export type VisitStatus = 'pending' | 'confirmed' | 'cancelled';

export interface ScheduledVisit {
  id: string;
  user_id: string;
  property_id: string;
  visit_date: string;
  visit_time: string;
  status: VisitStatus;
  created_at: string;
}

export interface UserPreferences {
  full_name?: string;
  phone?: string;
  language?: string;
}
