import i18n from '../i18n';

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

  let userFriendlyMessage = i18n.t('errors.generic', { defaultValue: 'An error occurred while saving your changes. Please retry.' });

  if (errorCode === 'permission-denied') {
    userFriendlyMessage = i18n.t('errors.permissionDenied', {
      action: context.action,
      entityType: context.entityType,
      defaultValue: `Access Denied: You do not have sufficient permissions to ${context.action} this ${context.entityType}. Verify your organization role.`
    });
  } else if (errorCode === 'not-found') {
    userFriendlyMessage = i18n.t('errors.notFound', {
      entityType: context.entityType,
      defaultValue: `The requested ${context.entityType} could not be found. It may have been removed.`
    });
  } else if (errorCode === 'already-exists') {
    userFriendlyMessage = i18n.t('errors.alreadyExists', {
      entityType: context.entityType,
      defaultValue: `A ${context.entityType} with this identifier already exists in your workspace.`
    });
  } else if (errorCode === 'resource-exhausted') {
    userFriendlyMessage = i18n.t('errors.resourceExhausted', {
      defaultValue: `Database request limit reached. Please wait a moment and try again.`
    });
  } else if (errorCode === 'failed-precondition') {
    userFriendlyMessage = i18n.t('errors.failedPrecondition', {
      defaultValue: `Operation aborted: The procurement record is in a state that cannot be modified under SOX policies.`
    });
  } else if (errorCode === 'unauthenticated') {
    userFriendlyMessage = i18n.t('errors.unauthenticated', {
      defaultValue: `Your session has expired. Please sign in again with your enterprise account.`
    });
  }

  const customError = new Error(userFriendlyMessage);
  (customError as any).originalCode = errorCode;
  (customError as any).context = context;
  return customError;
}
