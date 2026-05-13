// POST /api/demo/seed - Seed demo data to KV
// DELETE /api/demo/seed - Clear demo data from KV
// Protected: Requires authenticated admin session

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@/lib/researcherContext';
import { saveStudy, saveInterview, isKVAvailable, getAllStudies } from '@/lib/kv';
import { DEMO_STUDIES, DEMO_INTERVIEWS } from '@/lib/demoData';

export async function POST() {
  try {
    const { authorized, context, error } = await getRequestContext();
    if (!authorized || !context) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    const kvAvailable = await isKVAvailable(context.kvClient);
    if (!kvAvailable) {
      return NextResponse.json(
        { error: 'Storage not configured. Please connect Vercel KV (Upstash Redis) first.' },
        { status: 503 }
      );
    }

    // Check if demo data already exists
    const existingStudies = await getAllStudies(context.kvClient);
    const demoExists = existingStudies.some(s => s.id.startsWith('demo-'));
    if (demoExists) {
      return NextResponse.json(
        { error: 'Demo data already loaded. Clear it first if you want to reload.' },
        { status: 409 }
      );
    }

    // Seed studies
    let studiesSeeded = 0;
    for (const study of DEMO_STUDIES) {
      const success = await saveStudy(study, context.kvClient);
      if (success) studiesSeeded++;
    }

    // Seed interviews
    let interviewsSeeded = 0;
    for (const interview of DEMO_INTERVIEWS) {
      const success = await saveInterview(interview, context.kvClient);
      if (success) interviewsSeeded++;
    }

    return NextResponse.json({
      success: true,
      message: 'Demo data loaded successfully',
      data: {
        studiesSeeded,
        interviewsSeeded,
        aggregateSynthesisAvailable: true
      }
    });
  } catch (error) {
    console.error('Demo seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed demo data' },
      { status: 500 }
    );
  }
}

// DELETE /api/demo/seed - Clear demo data from KV
export async function DELETE() {
  try {
    const { authorized, context, error } = await getRequestContext();
    if (!authorized || !context) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    const kvAvailable = await isKVAvailable(context.kvClient);
    if (!kvAvailable) {
      return NextResponse.json(
        { error: 'Storage not configured.' },
        { status: 503 }
      );
    }

    // Use the researcher's KV client directly for cleanup operations
    const kv = context.kvClient;

    // Delete demo studies AND every interview linked to them.
    // (Previous version only cleared interviews enumerated in DEMO_INTERVIEWS,
    // leaving orphan interviews if any extra ones got attached to a demo study.
    // Reset must produce a truly clean slate so re-seeding restores the exact
    // canonical 3 interviews.)
    let studiesDeleted = 0;
    let interviewsDeleted = 0;
    for (const study of DEMO_STUDIES) {
      // 1) Read every interview id currently linked to this demo study
      const linkedIds = (await kv.smembers(`study-interviews:${study.id}`)) as string[];
      for (const id of linkedIds) {
        await kv.del(`interview:${id}`);
        await kv.srem('all-interviews', id);
        interviewsDeleted++;
      }
      // 2) Clear the per-study interview index
      await kv.del(`study-interviews:${study.id}`);
      // 3) Remove the study itself
      await kv.del(`study:${study.id}`);
      await kv.srem('all-studies', study.id);
      studiesDeleted++;
    }

    return NextResponse.json({
      success: true,
      message: 'Demo data cleared',
      data: {
        studiesDeleted,
        interviewsDeleted
      }
    });
  } catch (error) {
    console.error('Demo clear error:', error);
    return NextResponse.json(
      { error: 'Failed to clear demo data' },
      { status: 500 }
    );
  }
}
