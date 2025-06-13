import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminDb } from '@/lib/firebase/admin';
import { ChildProfile } from '@/types/child';

// GET /api/children - Get all children or filter by query parameters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const guardianId = searchParams.get('guardianId');
    const schoolId = searchParams.get('schoolId');
    
    let childrenRef = adminDb.collection('children');
    
    // Apply filters if provided
    if (guardianId) {
      childrenRef = childrenRef.where('guardians', 'array-contains', guardianId);
    }
    
    if (schoolId) {
      childrenRef = childrenRef.where('school.id', '==', schoolId);
    }
    
    // Only return active children
    childrenRef = childrenRef.where('isActive', '==', true);
    
    const childrenSnapshot = await childrenRef.get();
    const children = childrenSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/children - Create a new child profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.dateOfBirth || !data.gender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const userId = (session.user as any).id;
    const childId = `${userId}_${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    const childData: ChildProfile = {
      id: childId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      photoURL: data.photoURL,
      guardians: [userId, ...(data.guardians || [])],
      school: data.school,
      medicalInfo: data.medicalInfo,
      identifiers: data.identifiers,
      physicalAttributes: data.physicalAttributes,
      emergencyContacts: data.emergencyContacts || [],
      lastUpdated: timestamp,
      createdAt: timestamp,
      isActive: true,
    };
    
    await adminDb.collection('children').doc(childId).set(childData);
    
    return NextResponse.json({ id: childId, ...childData }, { status: 201 });
  } catch (error) {
    console.error('Error creating child profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/children - Update a child profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ error: 'Missing child ID' }, { status: 400 });
    }
    
    const userId = (session.user as any).id;
    const childRef = adminDb.collection('children').doc(data.id);
    const childDoc = await childRef.get();
    
    if (!childDoc.exists) {
      return NextResponse.json({ error: 'Child profile not found' }, { status: 404 });
    }
    
    const childData = childDoc.data() as ChildProfile;
    
    // Check if the user is authorized to update this child profile
    if (!childData.guardians.includes(userId) && (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized to update this child profile' }, { status: 403 });
    }
    
    // Remove id from the update data
    const { id, ...updateData } = data;
    
    // Add lastUpdated timestamp
    updateData.lastUpdated = new Date().toISOString();
    
    await childRef.update(updateData);
    
    return NextResponse.json({ id: data.id, ...updateData });
  } catch (error) {
    console.error('Error updating child profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}