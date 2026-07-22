import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hjixouemhlxwrzdzxvru.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqaXhvdWVtaGx4d3J6ZHp4dnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NTIzNjUsImV4cCI6MjEwMDIyODM2NX0.muHAD6un92C0dkBcEdbS43QAjOTxHxRT3jALZQiDjjw";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);