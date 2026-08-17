import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

// Initialize Supabase admin client to bypass RLS and fetch all admin subscriptions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@157tattoo.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, title, guestName } = body;

    // Get all admin subscriptions
    const { data: subscriptions, error } = await supabaseAdmin
      .from('admin_subscriptions')
      .select('*');

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscriptions found' });
    }

    const payload = JSON.stringify({
      title: title || 'คิวจองใหม่! (New Booking)',
      message: message || `คุณมีคิวจองใหม่จากลูกค้า${guestName ? ': ' + guestName : ''}`,
      url: '/admin/appointments'
    });

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.subscription, payload);
      } catch (err: any) {
        console.error('Error sending push to subscription:', sub.id, err);
        // If subscription is invalid/expired (status 410/404), delete it
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabaseAdmin.from('admin_subscriptions').delete().eq('id', sub.id);
        }
      }
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true, notifiedCount: subscriptions.length });
  } catch (err: any) {
    console.error('Push notification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
