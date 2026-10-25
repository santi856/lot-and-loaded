// Lot & Loaded — runtime config.
// The Supabase project ref is the same one the house already runs on.
// The anon key is a PUBLIC key by design (safe in client code) — row-level
// security on the tables is what protects the data. See SETUP.md.
// If SUPABASE_ANON_KEY is left empty, the site runs in LOCAL FALLBACK mode:
// forms save submissions in the visitor's browser and admin.html can review
// and export them from that same browser. Nothing is sent anywhere.
window.PLATFORM_CONFIG={
SUPABASE_URL:"https://nxnqdmkacnpgsnolsjrq.supabase.co",
SUPABASE_ANON_KEY:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54bnFkbWthY25wZ3Nub2xzanJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMTUwMzYsImV4cCI6MjEwNzU5MTAzNn0.R0lwdfZs4FXTZ5sxRPk6uyEDPBTjAuQvWkBTiv6ejvo",// <-- paste the project anon key here (SETUP.md, step 2)
BUILDER_TABLE:"commercial_builder_intake",
LEAD_TABLE:"commercial_lead_registration",
SELLER_TABLE:"commercial_seller_submission"
};
