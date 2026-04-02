window.QUIZ_ONLINE_CONFIG = {
  // Passe a true pour activer le classement partage entre appareils.
  enabled: true,

  // Exemple Supabase: https://xyzcompany.supabase.co
  serviceUrl: "https://likdzjbyoicgsdwgsjid.supabase.co",

  // Cle "anon" Supabase (Project Settings > API > anon public key)
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpa2R6amJ5b2ljZ3Nkd2dzamlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODYwMzAsImV4cCI6MjA5MDY2MjAzMH0.65Vd_DLFoIkwRkv12u8ZMVnxP8OrGjFZuYf5PlA-0j4",

  // Nom de la table SQL qui stocke les scores.
  table: "quiz_leaderboard",
};
