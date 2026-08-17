import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get subscription from request body
    const body = await req.json();
    const { subscription } = body;

    if (!subscription) {
      return NextResponse.json({ error: 'Missing subscription' }, { status: 400 });
    }

    // Upsert subscription
    // Since a user can have multiple devices, we should ideally check if the subscription endpoint already exists.
    // For simplicity, we can insert it. But checking by user_id and endpoint is better.
    // However, since we don't have a unique constraint on endpoint in our SQL, we'll just insert.
    // If we want to avoid duplicates, we can delete the old one first.
    
    // First, let's just insert it.
    const { error } = await supabase
      .from('admin_subscriptions')
      .insert({
        user_id: user.id,
        subscription: subscription
      });

    if (error) {
      console.error('Error saving subscription:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Subscription error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
