// Aqui van los datos de tu proyecto de Supabase.
// Los encuentras en tu panel de Supabase, en Settings > API.
// SUPABASE_URL es la direccion de tu proyecto (Project URL).
// SUPABASE_ANON_KEY es la llave publica (anon public key).
// Esta llave no es secreta: esta protegida por las reglas de acceso (RLS)
// que vamos a crear en la tabla, asi que es normal que quede en este archivo.

const SUPABASE_URL = "https://hhxxrrvxycyujcvmbocg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_o3jpLaaeaynmVGjNUuzn4w_Y9k7GW50";

// Llave publica de notificaciones (VAPID). No es secreta, identifica a tu
// app frente al navegador. Su pareja privada vive solo en Supabase, nunca aqui.
const VAPID_PUBLIC_KEY = "BMVRLOct9m-JX-yDWORx3Lv1-EsEbJKUluzYCBA4XYDjQdgcihI0Fwc30feSV-4GFYQMwGKISueJefLegGxUQFA";
