// This file is a placeholder for Supabase-generated types.
//
// To generate real types from your database, run:
//   npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
//
// Or using the local CLI:
//   npx supabase gen types typescript --local > src/types/database.types.ts
//
// Docs: https://supabase.com/docs/guides/api/rest/generating-types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
