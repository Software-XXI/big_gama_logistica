import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    await db.reports.add({
      id: body.id,
      code: body.code,
      status: body.status || 'DRAFT',
      operatorId: body.operatorId,
      conductorId: body.conductorId,
      bitacora: body.bitacora || '',
      latitude: body.latitude,
      longitude: body.longitude,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    if (body.items) {
      for (const item of body.items) {
        await db.reportItems.add(item);
      }
    }
    
    return NextResponse.json({ success: true, id: body.id });
  } catch (error) {
    console.error('Error saving report:', error);
    return NextResponse.json({ error: 'Error guardando reporte' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reports = await db.reports.orderBy('createdAt').reverse().toArray();
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Error obteniendo reportes' }, { status: 500 });
  }
}