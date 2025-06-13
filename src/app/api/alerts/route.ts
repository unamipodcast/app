import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminDb } from '@/lib/firebase/admin';
import { MissingChildAlert } from '@/types/child';

// GET /api/alerts - Get all alerts or filter by query parameters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const childId = searchParams.get('childId');
    const reporterId = searchParams.get('reporterId');
    
    let alertsRef = adminDb.collection('alerts');
    
    // Apply filters if provided
    if (status) {
      alertsRef = alertsRef.where('status', '==', status);
    }
    
    if (childId) {
      alertsRef = alertsRef.where('childId', '==', childId);
    }
    
    if (reporterId) {
      alertsRef = alertsRef.where('reporterId', '==', reporterId);
    }
    
    // Order by date reported, most recent first
    alertsRef = alertsRef.orderBy('dateReported', 'desc');
    
    const alertsSnapshot = await alertsRef.get();
    const alerts = alertsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/alerts - Create a new alert
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.childId || !data.reporterId || !data.lastSeenLocation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const alertId = `alert_${data.childId}_${Date.now()}`;
    const dateReported = new Date().toISOString();
    
    const alertData: MissingChildAlert = {
      id: alertId,
      childId: data.childId,
      reporterId: data.reporterId,
      status: 'active',
      dateReported,
      lastSeenLocation: {
        address: data.lastSeenLocation.address,
        latitude: data.lastSeenLocation.latitude,
        longitude: data.lastSeenLocation.longitude,
        timestamp: data.lastSeenLocation.timestamp || dateReported,
      },
      lastSeenWearing: data.lastSeenWearing,
      additionalDetails: data.additionalDetails,
    };
    
    await adminDb.collection('alerts').doc(alertId).set(alertData);
    
    return NextResponse.json({ id: alertId, ...alertData }, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/alerts - Update an alert status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    if (!data.id || !data.status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const alertRef = adminDb.collection('alerts').doc(data.id);
    const alertDoc = await alertRef.get();
    
    if (!alertDoc.exists) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    
    const updateData: any = {
      status: data.status,
    };
    
    if (data.status === 'resolved') {
      updateData.dateResolved = new Date().toISOString();
      updateData.resolvedBy = (session.user as any).id;
      updateData.resolutionDetails = data.resolutionDetails || '';
    }
    
    await alertRef.update(updateData);
    
    return NextResponse.json({ id: data.id, ...updateData });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}