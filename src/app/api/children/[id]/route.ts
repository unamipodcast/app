import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { adminDb } from '@/lib/firebase/admin';
import { childProfileSchema } from '@/lib/utils/validation';
import { createErrorResponse, withErrorHandling } from '@/lib/utils/errorHandler';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const childId = params.id;
    
    // Verify authentication
    const session = await getServerSession();
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Get user ID and role from session
    const userId = (session.user as any).id;
    const role = (session.user as any).role || 'parent';

    try {
      // Get the child document
      const childDoc = await adminDb.collection('children').doc(childId).get();
      
      if (!childDoc.exists) {
        return createErrorResponse('Child profile not found', 404);
      }
      
      const childData = childDoc.data();
      
      // Check if user has permission to view this child
      if (role !== 'admin' && role !== 'authority') {
        // For parents, check if they are in the guardians array
        if (role === 'parent' && (!childData?.guardians || !childData.guardians.includes(userId))) {
          // Also check parentId for backward compatibility
          if (childData?.parentId !== userId) {
            return createErrorResponse('Access denied', 403);
          }
        }
        
        // For schools, check if they are the school for this child
        if (role === 'school' && childData?.schoolId !== userId) {
          return createErrorResponse('Access denied', 403);
        }
      }

      // Create an audit log entry for sensitive data access
      if (role === 'authority' || role === 'admin') {
        await adminDb.collection('audit_logs').add({
          userId,
          userRole: role,
          operation: 'view_child',
          resourceId: childId,
          resourceType: 'children',
          timestamp: new Date().toISOString(),
          details: `Viewed child profile for ${childData?.firstName} ${childData?.lastName}`
        });
      }

      return Response.json({
        id: childDoc.id,
        ...childData
      });
    } catch (error) {
      console.error(`Error fetching child ${childId}:`, error);
      return createErrorResponse('Failed to fetch child profile', 500);
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const childId = params.id;
    
    // Verify authentication
    const session = await getServerSession();
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Get user ID and role from session
    const userId = (session.user as any).id;
    const role = (session.user as any).role || 'parent';

    try {
      // Get the child document to check permissions
      const childDoc = await adminDb.collection('children').doc(childId).get();
      
      if (!childDoc.exists) {
        return createErrorResponse('Child profile not found', 404);
      }
      
      const childData = childDoc.data();
      
      // Check if user has permission to update this child
      if (role !== 'admin') {
        // For parents, check if they are in the guardians array
        if (role === 'parent' && (!childData?.guardians || !childData.guardians.includes(userId))) {
          // Also check parentId for backward compatibility
          if (childData?.parentId !== userId) {
            return createErrorResponse('Access denied', 403);
          }
        }
        
        // Schools should not update child profiles directly
        if (role === 'school' || role === 'authority' || role === 'community') {
          return createErrorResponse('Access denied', 403);
        }
      }

      // Get update data
      const updateData = await request.json();
      
      // Validate update data (partial validation)
      try {
        // Use partial validation for updates
        const partialSchema = childProfileSchema.partial();
        partialSchema.parse(updateData);
      } catch (validationError: any) {
        return createErrorResponse(
          'Validation error', 
          400, 
          validationError.errors?.map((e: any) => e.message).join(', ')
        );
      }

      // Add updated timestamp
      const timestamp = new Date().toISOString();
      const updatedData = {
        ...updateData,
        updatedAt: timestamp,
      };

      // Update the child profile in Firestore
      await adminDb.collection('children').doc(childId).update(updatedData);
      
      // Create an audit log entry
      await adminDb.collection('audit_logs').add({
        userId,
        userRole: role,
        operation: 'update_child',
        resourceId: childId,
        resourceType: 'children',
        timestamp,
        details: `Updated child profile for ${childData?.firstName} ${childData?.lastName}`
      });

      // Return the updated child profile
      return Response.json({
        id: childId,
        ...childData,
        ...updatedData
      });
    } catch (error) {
      console.error(`Error updating child ${childId}:`, error);
      return createErrorResponse('Failed to update child profile', 500);
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const childId = params.id;
    
    // Verify authentication
    const session = await getServerSession();
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Get user ID and role from session
    const userId = (session.user as any).id;
    const role = (session.user as any).role || 'parent';

    // Only admins can delete child profiles
    if (role !== 'admin') {
      return createErrorResponse('Access denied', 403);
    }

    try {
      // Get the child document for audit logging
      const childDoc = await adminDb.collection('children').doc(childId).get();
      
      if (!childDoc.exists) {
        return createErrorResponse('Child profile not found', 404);
      }
      
      const childData = childDoc.data();

      // Delete the child profile
      await adminDb.collection('children').doc(childId).delete();
      
      // Create an audit log entry
      await adminDb.collection('audit_logs').add({
        userId,
        userRole: role,
        operation: 'delete_child',
        resourceId: childId,
        resourceType: 'children',
        timestamp: new Date().toISOString(),
        details: `Deleted child profile for ${childData?.firstName} ${childData?.lastName}`
      });

      return Response.json({ success: true });
    } catch (error) {
      console.error(`Error deleting child ${childId}:`, error);
      return createErrorResponse('Failed to delete child profile', 500);
    }
  });
}