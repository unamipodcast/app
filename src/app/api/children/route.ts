import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { adminDb } from '@/lib/firebase/admin';
import { childProfileSchema } from '@/lib/utils/validation';
import { createErrorResponse, withErrorHandling } from '@/lib/utils/errorHandler';

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    // Verify authentication
    const session = await getServerSession();
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Get user ID from session
    const userId = (session.user as any).id;
    if (!userId) {
      return createErrorResponse('Invalid user session', 400);
    }

    // Get user role
    const role = (session.user as any).role || 'parent';

    try {
      let childrenRef = adminDb.collection('children');
      let queryRef;

      // Apply role-specific filters
      if (role === 'parent') {
        // For parents, only show their children
        queryRef = childrenRef.where('guardians', 'array-contains', userId);
      } else if (role === 'school') {
        // For schools, show children associated with the school
        queryRef = childrenRef.where('schoolId', '==', userId);
      } else if (role === 'admin' || role === 'authority') {
        // Admins and authorities can see all children
        queryRef = childrenRef;
      } else {
        // Community leaders should not see children directly
        return createErrorResponse('Access denied', 403);
      }

      const snapshot = await queryRef.get();
      
      const children = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return Response.json({ children });
    } catch (error) {
      console.error('Error fetching children:', error);
      return createErrorResponse('Failed to fetch children', 500);
    }
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    // Verify authentication
    const session = await getServerSession();
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Get user ID from session
    const userId = (session.user as any).id;
    if (!userId) {
      return createErrorResponse('Invalid user session', 400);
    }

    // Get user role
    const role = (session.user as any).role || 'parent';
    
    // Only parents and admins can create child profiles
    if (role !== 'parent' && role !== 'admin') {
      return createErrorResponse('Access denied', 403);
    }

    try {
      const data = await request.json();
      
      // Validate child profile data
      try {
        childProfileSchema.parse(data);
      } catch (validationError: any) {
        return createErrorResponse(
          'Validation error', 
          400, 
          validationError.errors?.map((e: any) => e.message).join(', ')
        );
      }

      // Ensure the current user is in the guardians array
      if (!data.guardians || !data.guardians.includes(userId)) {
        data.guardians = [...(data.guardians || []), userId];
      }

      // Check for duplicate child based on identificationNumber if provided
      if (data.identificationNumber) {
        const existingChildSnapshot = await adminDb.collection('children')
          .where('identificationNumber', '==', data.identificationNumber)
          .get();
        
        if (!existingChildSnapshot.empty) {
          return createErrorResponse(
            'Duplicate child record', 
            409, 
            `A child with identification number ${data.identificationNumber} already exists`
          );
        }
      }
      
      // Check for potential duplicate based on name and date of birth
      const existingNameDobSnapshot = await adminDb.collection('children')
        .where('firstName', '==', data.firstName)
        .where('lastName', '==', data.lastName)
        .where('dateOfBirth', '==', data.dateOfBirth)
        .get();
      
      if (!existingNameDobSnapshot.empty) {
        return createErrorResponse(
          'Potential duplicate child record', 
          409, 
          `A child with the same name and date of birth already exists`
        );
      }

      // Add timestamps and creator info
      const timestamp = new Date().toISOString();
      const childData = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: userId,
      };

      // Create the child profile in Firestore
      const docRef = await adminDb.collection('children').add(childData);
      
      // Create an audit log entry
      await adminDb.collection('audit_logs').add({
        userId,
        userRole: role,
        operation: 'create_child',
        resourceId: docRef.id,
        resourceType: 'children',
        timestamp,
        details: `Created child profile for ${data.firstName} ${data.lastName}`
      });

      // Return the created child profile with ID
      return Response.json({
        id: docRef.id,
        ...childData
      }, { status: 201 });
    } catch (error) {
      console.error('Error creating child profile:', error);
      return createErrorResponse('Failed to create child profile', 500);
    }
  });
}