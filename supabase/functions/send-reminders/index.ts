// Esta funcion vive en los servidores de Supabase, no en el celular de nadie.
// Un cron job (una tarea programada) la llama cada cierto tiempo. Cada vez
// que corre: busca pendientes cuya hora de aviso ya llego, le manda una
// notificacion push a cada aparato suscrito de esa persona, y marca el
// pendiente como "ya avisado" para no repetir el aviso.

import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:liliana.yanayaco@gmail.com';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const nowIso = new Date().toISOString();

  const { data: dueTasks, error: tasksError } = await supabase
    .from('tasks')
    .select('id, user_id, title, emoji')
    .lte('remind_at', nowIso)
    .eq('reminded', false)
    .neq('status', 'completado');

  if (tasksError) {
    return new Response(JSON.stringify({ error: tasksError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let notificationsSent = 0;

  for (const task of dueTasks ?? []) {
    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_id', task.user_id);

    const payload = JSON.stringify({
      title: (task.emoji || '📌') + ' ' + task.title,
      body: 'Tu pendiente está por vencer.',
      url: './index.html',
    });

    for (const sub of subs ?? []) {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      };
      try {
        await webpush.sendNotification(pushSubscription, payload);
        notificationsSent++;
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
        }
      }
    }

    await supabase.from('tasks').update({ reminded: true }).eq('id', task.id);
  }

  return new Response(
    JSON.stringify({ ok: true, tasksProcessed: (dueTasks ?? []).length, notificationsSent }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});
