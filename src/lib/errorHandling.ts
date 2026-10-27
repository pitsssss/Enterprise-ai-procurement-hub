/**
 * Standard Firestore error handling helper per Firebase Integration Skill
 */

export interface FirestoreErrorContext {
  action: 'create' | 'read' | 'update' | 'delete' | 'list' | 'batch';
  entityType: string;
  entityId?: string;
  orgId?: string;
}

export function handleFirestoreError(error: unknown, context: FirestoreErrorContext): Error {
  const err = error as { code?: string; message?: string };
  const errorCode = err.code || 'unknown';
  const rawMessage = err.message || 'An unexpected database error occurred.';

  console.error(`[FirestoreError] [${context.action.toUpperCase()}] on ${context.entityType}${context.entityId ? `:${context.entityId}` : ''}:`, {
    code: errorCode,
    message: rawMessage,
    context,
  });

  let userFriendlyMessage = 'An error occurred while saving your changes. Please retry.';

  if (errorCode === 'permission-denied') {
    userFriendlyMessage = `Access Denied: You do not have sufficient permissions to ${context.action} this ${context.entityType}. Verify your organization role.`;
  } else if (errorCode === 'not-found') {
    userFriendlyMessage = `The requested ${context.entityType} could not be found. It may have been removed.`;
  } else if (errorCode === 'already-exists') {
    userFriendlyMessage = `A ${context.entityType} with this identifier already exists in your workspace.`;
  } else if (errorCode === 'resource-exhausted') {
    userFriendlyMessage = `Database request limit reached. Please wait a moment and try again.`;
  } else if (errorCode === 'failed-precondition') {
    userFriendlyMessage = `Operation aborted: The procurement record is in a state that cannot be modified under SOX policies.`;
  } else if (errorCode === 'unauthenticated') {
    userFriendlyMessage = `Your session has expired. Please sign in again with your enterprise account.`;
  }

  const customError = new Error(userFriendlyMessage);
  (customError as any).originalCode = errorCode;
  (customError as any).context = context;
  return customError;
}
