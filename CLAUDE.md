# Mi Planner

Herramienta personal de pendientes de Liliana. Uso individual, con cuenta propia (correo y contraseña).

## Decisiones fijas

- Todo debe ser gratuito. No usar servicios pagos ni añadir dependencias con costo.
- Frontend en HTML, CSS y JavaScript simple, sin frameworks (sin React, Next.js, etc). El proyecto es pequeño y no lo justifica.
- Base de datos y login: Supabase (plan gratuito). La tabla de pendientes es `tasks`, con RLS activado para que cada usuario solo vea y modifique sus propias filas (`auth.uid() = user_id`).
- Publicación: GitHub Pages, sirviendo `index.html` desde la raíz del repositorio.
- Las llaves de Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) viven en `supabase-config.js`. La llave anon no es secreta, está protegida por RLS.
- Uso individual: no hay roles, ni compartir pendientes entre cuentas, ni panel de administración.
