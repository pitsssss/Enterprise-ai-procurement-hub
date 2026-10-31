import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError } from '../lib/errorHandling';
import {
  Organization,
  OrganizationMember,
  UserProfile,
  RFQ,
  Vendor,
  VendorBid,
  PurchaseOrder,
  AuditEvent,
  ProcurementNotification,
  UserRole,
} from '../types/procurement';
import { INITIAL_RFQS, INITIAL_BIDS, INITIAL_VENDORS, INITIAL_POS } from '../data/mockData';

// User Profile & Tenant Isolation Operations
export async function getOrCreateUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}): Promise<{ profile: UserProfile; organization: Organization; member: OrganizationMember }> {
  try {
    const userRef = doc(db, 'userProfiles', user.uid);
    const userSnap = await getDoc(userRef);
    const userEmail = (user.email || '').toLowerCase().trim();

    // 1. Existing user with established profile
    if (userSnap.exists()) {
      const profile = userSnap.data() as UserProfile;
      const orgRef = doc(db, 'organizations', profile.currentOrgId);
      const orgSnap = await getDoc(orgRef);

      if (orgSnap.exists()) {
        const organization = orgSnap.data() as Organization;
        const memberRef = doc(db, 'organizations', organization.id, 'members', user.uid);
        const memberSnap = await getDoc(memberRef);

        if (memberSnap.exists()) {
          const member = memberSnap.data() as OrganizationMember;
          return { profile, organization, member };
        }
      }
    }

    // 2. Check for an authorized pending invitation matching the user's email
    let claimedOrg: Organization | null = null;
    let claimedMember: OrganizationMember | null = null;

    if (userEmail) {
      const inviteRef = doc(db, 'userInvitations', userEmail);
      const inviteSnap = await getDoc(inviteRef);

      if (inviteSnap.exists()) {
        const inviteData = inviteSnap.data();
        if (inviteData.status === 'PENDING' && inviteData.orgId) {
          const invitedOrgRef = doc(db, 'organizations', inviteData.orgId);
          const invitedOrgSnap = await getDoc(invitedOrgRef);

          if (invitedOrgSnap.exists()) {
            claimedOrg = invitedOrgSnap.data() as Organization;
            claimedMember = {
              uid: user.uid,
              orgId: claimedOrg.id,
              email: user.email || '',
              displayName: user.displayName || userEmail.split('@')[0] || 'Enterprise Specialist',
              role: inviteData.role || 'BUYER',
              department: inviteData.department || 'Procurement Operations',
              joinedAt: new Date().toISOString(),
            };

            // Write member record to the invited organization
            await setDoc(doc(db, 'organizations', claimedOrg.id, 'members', user.uid), claimedMember);

            // Mark invitation accepted in directory
            await updateDoc(inviteRef, {
              status: 'ACCEPTED',
              acceptedByUid: user.uid,
              acceptedAt: new Date().toISOString(),
            });

            try {
              await updateDoc(doc(db, 'organizations', claimedOrg.id, 'invitations', userEmail), {
                status: 'ACCEPTED',
                acceptedByUid: user.uid,
              });
            } catch (_) {}
          }
        }
      }
    }

    if (claimedOrg && claimedMember) {
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || userEmail.split('@')[0] || 'Enterprise Specialist',
        photoURL: user.photoURL || undefined,
        currentOrgId: claimedOrg.id,
        language: 'en',
        theme: 'light',
        department: claimedMember.department,
        title: 'Procurement Specialist',
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userRef, profile);
      return { profile, organization: claimedOrg, member: claimedMember };
    }

    // 3. New user without invitation: Securely provision an isolated personal organization
    // Automatic ADMIN role is strictly confined to their own newly created organization
    const personalOrgId = `org-${user.uid.slice(0, 12)}`;
    const organization = await getOrCreatePersonalOrg(personalOrgId, user.uid, user.displayName, user.email);

    const member: OrganizationMember = {
      uid: user.uid,
      orgId: personalOrgId,
      email: user.email || '',
      displayName: user.displayName || userEmail.split('@')[0] || 'Enterprise Lead',
      role: 'ADMIN',
      department: 'Global Sourcing & Supply Chain',
      joinedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'organizations', personalOrgId, 'members', user.uid), member);

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || userEmail.split('@')[0] || 'Enterprise Lead',
      photoURL: user.photoURL || undefined,
      currentOrgId: personalOrgId,
      language: 'en',
      theme: 'light',
      title: 'VP of Strategic Procurement',
      department: 'Global Sourcing & Supply Chain',
      updatedAt: new Date().toISOString(),
    };

    await setDoc(userRef, profile);

    return { profile, organization, member };
  } catch (err) {
    throw handleFirestoreError(err, {
      action: 'create',
      entityType: 'UserProfile',
      entityId: user.uid,
    });
  }
}

async function getOrCreatePersonalOrg(
  orgId: string,
  ownerUid: string,
  displayName: string | null,
  email: string | null
): Promise<Organization> {
  const orgRef = doc(db, 'organizations', orgId);
  const orgSnap = await getDoc(orgRef);

  if (orgSnap.exists()) {
    return orgSnap.data() as Organization;
  }

  const orgName = displayName
    ? `${displayName}'s Enterprise Sourcing`
    : email
    ? `${email.split('@')[0].toUpperCase()} Global Procurement`
    : 'Synthetix Strategic Operations';

  const newOrg: Organization = {
    id: orgId,
    name: orgName,
    slug: `tenant-${ownerUid.slice(0, 8)}`,
    defaultCurrency: 'USD',
    soxComplianceEnabled: true,
    soxThresholdUSD: 250000,
    createdAt: new Date().toISOString(),
    ownerUid: ownerUid,
  };

  await setDoc(orgRef, newOrg);
  await seedInitialOrganizationData(orgId, ownerUid);

  return newOrg;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'userProfiles', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    throw handleFirestoreError(err, { action: 'update', entityType: 'UserProfile', entityId: uid });
  }
}

// Seed helper for fresh workspaces
export async function seedInitialOrganizationData(orgId: string, ownerUid: string) {
  try {
    const batch = writeBatch(db);

    // Seed RFQs
    INITIAL_RFQS.forEach((rfq) => {
      const rfqDoc = doc(db, 'organizations', orgId, 'rfqs', rfq.id);
      batch.set(rfqDoc, {
        ...rfq,
        orgId,
        createdBy: ownerUid,
      });
    });

    // Seed Vendors
    INITIAL_VENDORS.forEach((vendor) => {
      const vendorDoc = doc(db, 'organizations', orgId, 'vendors', vendor.id);
      batch.set(vendorDoc, {
        ...vendor,
        orgId,
      });
    });

    // Seed Bids
    INITIAL_BIDS.forEach((bid) => {
      const bidDoc = doc(db, 'organizations', orgId, 'bids', bid.id);
      batch.set(bidDoc, {
        ...bid,
        orgId,
      });
    });

    // Seed POs
    INITIAL_POS.forEach((po) => {
      const poDoc = doc(db, 'organizations', orgId, 'pos', po.id);
      batch.set(poDoc, {
        ...po,
        orgId,
        soxHold: po.amount >= 250000 && !po.complianceCleared,
      });
    });

    // Seed Initial Audit Event
    const initialAuditId = 'audit-init-01';
    const auditDoc = doc(db, 'organizations', orgId, 'auditEvents', initialAuditId);
    const initialAudit: AuditEvent = {
      id: initialAuditId,
      orgId,
      actorId: ownerUid,
      actorEmail: 'system@synthetix.corp',
      actorRole: 'ADMIN',
      action: 'WORKSPACE_PROVISIONED',
      entityType: 'ORGANIZATION',
      entityId: orgId,
      summary: 'Organization workspace provisioned with SOX-404 compliance rules active',
      timestamp: new Date().toISOString(),
    };
    batch.set(auditDoc, initialAudit);

    // Seed Initial Notification
    const notifId = 'notif-welcome';
    const notifDoc = doc(db, 'organizations', orgId, 'notifications', notifId);
    const welcomeNotif: ProcurementNotification = {
      id: notifId,
      orgId,
      title: 'Synthetix Sourcing Active',
      message: 'Persistent Firestore workspace connected with dual-approval SOX controls.',
      type: 'INFO',
      read: false,
      createdAt: new Date().toISOString(),
      linkTab: 'overview',
    };
    batch.set(notifDoc, welcomeNotif);

    await batch.commit();
  } catch (err) {
    console.error('Failed to seed initial organization data:', err);
  }
}

// Live Subscriptions
export function subscribeRfqs(orgId: string, onUpdate: (rfqs: RFQ[]) => void) {
  const colRef = collection(db, 'organizations', orgId, 'rfqs');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as RFQ);
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, { action: 'list', entityType: 'RFQ', orgId });
    }
  );
}

export function subscribeVendors(orgId: string, onUpdate: (vendors: Vendor[]) => void) {
  const colRef = collection(db, 'organizations', orgId, 'vendors');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as Vendor);
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, { action: 'list', entityType: 'Vendor', orgId });
    }
  );
}

export function subscribeBids(orgId: string, onUpdate: (bids: VendorBid[]) => void) {
  const colRef = collection(db, 'organizations', orgId, 'bids');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as VendorBid);
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, { action: 'list', entityType: 'VendorBid', orgId });
    }
  );
}

export function subscribePos(orgId: string, onUpdate: (pos: PurchaseOrder[]) => void) {
  const colRef = collection(db, 'organizations', orgId, 'pos');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as PurchaseOrder);
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, { action: 'list', entityType: 'PurchaseOrder', orgId });
    }
  );
}

export function subscribeAuditEvents(orgId: string, onUpdate: (events: AuditEvent[]) => void) {
  const colRef = collection(db, 'organizations', orgId, 'auditEvents');
  const q = query(colRef, orderBy('timestamp', 'desc'), limit(50));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as AuditEvent);
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, { action: 'list', entityType: 'AuditEvent', orgId });
    }
  );
}

export function subscribeMembers(orgId: string, onUpdate: (members: OrganizationMember[]) => void) {
  const colRef = collection(db, 'organizations', orgId, 'members');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as OrganizationMember);
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, { action: 'list', entityType: 'OrganizationMember', orgId });
    }
  );
}

export function subscribeNotifications(orgId: string, onUpdate: (notifs: ProcurementNotification[]) => void) {
  const colRef = collection(db, 'organizations', orgId, 'notifications');
  const q = query(colRef, orderBy('createdAt', 'desc'), limit(20));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as ProcurementNotification);
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, { action: 'list', entityType: 'ProcurementNotification', orgId });
    }
  );
}

// Write Actions with Audit Logging
export async function logAuditEvent(
  orgId: string,
  event: Omit<AuditEvent, 'id' | 'orgId' | 'timestamp'>
): Promise<void> {
  try {
    const eventId = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullEvent: AuditEvent = {
      ...event,
      id: eventId,
      orgId,
      timestamp: new Date().toISOString(),
    };
    await setDoc(doc(db, 'organizations', orgId, 'auditEvents', eventId), fullEvent);
  } catch (err) {
    console.error('Failed to append immutable audit event:', err);
  }
}

export async function createRfq(
  orgId: string,
  rfqData: Omit<RFQ, 'id' | 'orgId' | 'createdAt'>,
  actor: { uid: string; email: string; role: UserRole }
): Promise<RFQ> {
  try {
    const id = `rfq-${Date.now().toString(36)}`;
    const newRfq: RFQ = {
      ...rfqData,
      id,
      orgId,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: actor.uid,
    };

    await setDoc(doc(db, 'organizations', orgId, 'rfqs', id), newRfq);

    await logAuditEvent(orgId, {
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'RFQ_CREATED',
      entityType: 'RFQ',
      entityId: id,
      summary: `Created RFQ ${newRfq.rfqNumber}: ${newRfq.title} (Budget: $${newRfq.budget.toLocaleString()})`,
    });

    return newRfq;
  } catch (err) {
    throw handleFirestoreError(err, { action: 'create', entityType: 'RFQ', orgId });
  }
}

export async function awardRfqBid(
  orgId: string,
  rfqId: string,
  bid: VendorBid,
  actor: { uid: string; email: string; role: UserRole }
): Promise<{ rfq: Partial<RFQ>; newPo: PurchaseOrder }> {
  try {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    // 1. Update RFQ to AWARDED
    const rfqRef = doc(db, 'organizations', orgId, 'rfqs', rfqId);
    batch.update(rfqRef, {
      status: 'AWARDED',
      awardedBidId: bid.id,
      awardedVendorName: bid.vendorName,
      awardedAt: now,
    });

    // 2. Automatically generate Purchase Order
    const poId = `po-${Date.now().toString(36)}`;
    const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isSoxFlagged = bid.unitPriceTotal >= 250000;

    const newPo: PurchaseOrder = {
      id: poId,
      orgId,
      poNumber,
      rfqRef: rfqId.toUpperCase(),
      vendorName: bid.vendorName,
      amount: bid.unitPriceTotal,
      currency: 'USD',
      status: isSoxFlagged ? 'FLAGGED' : 'PENDING_APPROVAL',
      issueDate: now.split('T')[0],
      approverRole: isSoxFlagged ? 'VP of Finance (Dual SOX Sign-off)' : 'Procurement Director',
      paymentTerms: 'Net 45 Enterprise',
      complianceWarning: isSoxFlagged
        ? 'Internal Fiduciary Alert: Exceeds $250k single-source delegation limit. Requires Form CS-8 waiver.'
        : undefined,
      complianceCleared: !isSoxFlagged,
      soxHold: isSoxFlagged,
      createdBy: actor.uid,
      createdByEmail: actor.email,
    };

    const poRef = doc(db, 'organizations', orgId, 'pos', poId);
    batch.set(poRef, newPo);

    await batch.commit();

    // 3. Log Audit Trail with Verified Actor
    await logAuditEvent(orgId, {
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'BID_AWARDED',
      entityType: 'BID',
      entityId: bid.id,
      summary: `Awarded RFQ ${rfqId} to ${bid.vendorName} ($${bid.unitPriceTotal.toLocaleString()} USD, Quote: ${bid.quoteRef}) and generated ${poNumber}`,
    });

    return { rfq: { status: 'AWARDED', awardedBidId: bid.id }, newPo };
  } catch (err) {
    throw handleFirestoreError(err, { action: 'update', entityType: 'RFQ', entityId: rfqId, orgId });
  }
}

export async function approvePurchaseOrder(
  orgId: string,
  poId: string,
  poNumber: string,
  actor: { uid: string; email: string; role: UserRole }
): Promise<void> {
  try {
    const poRef = doc(db, 'organizations', orgId, 'pos', poId);
    const poSnap = await getDoc(poRef);
    if (!poSnap.exists()) {
      throw new Error(`Purchase Order ${poNumber} does not exist.`);
    }
    const poData = poSnap.data() as PurchaseOrder;

    // 1. Separation of Duties: Prevent self-approval
    if (
      poData.createdBy === actor.uid ||
      (poData.createdByEmail && poData.createdByEmail.toLowerCase() === actor.email.toLowerCase())
    ) {
      throw new Error(
        'Separation of Duties Violation: Fiduciary policy prevents buyers or requisition creators from self-approving purchase orders.'
      );
    }

    // 2. Dual Sign-Off Requirement: Approver cannot be the same person who authorized the Form CS-8 waiver
    if (poData.waiverSignedBy && poData.waiverSignedBy.toLowerCase() === actor.email.toLowerCase()) {
      throw new Error(
        'Dual Sign-Off Requirement: Secondary PO approver must be distinct from the Form CS-8 waiver signatory.'
      );
    }

    // 3. SOX / Policy Hold Verification
    if (poData.soxHold && !poData.waiverSignedBy) {
      throw new Error(
        `Policy Hold: Order ${poNumber} exceeds single-source threshold. Form CS-8 waiver must be authorized before final approval.`
      );
    }

    const now = new Date().toISOString();

    await updateDoc(poRef, {
      status: 'APPROVED',
      approvedBy: actor.email,
      approvedAt: now,
    });

    await logAuditEvent(orgId, {
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'PO_APPROVED',
      entityType: 'PURCHASE_ORDER',
      entityId: poId,
      summary: `Approved Purchase Order ${poNumber} by ${actor.role} (${actor.email})`,
    });
  } catch (err) {
    throw handleFirestoreError(err, { action: 'update', entityType: 'PurchaseOrder', entityId: poId, orgId });
  }
}

export async function resolveSoxWaiver(
  orgId: string,
  poId: string,
  poNumber: string,
  justification: string,
  actor: { uid: string; email: string; role: UserRole }
): Promise<void> {
  try {
    const poRef = doc(db, 'organizations', orgId, 'pos', poId);
    const poSnap = await getDoc(poRef);
    if (!poSnap.exists()) {
      throw new Error(`Purchase Order ${poNumber} does not exist.`);
    }
    const poData = poSnap.data() as PurchaseOrder;

    // Separation of Duties: Creator cannot authorize sole-source waiver for their own requisition
    if (
      poData.createdBy === actor.uid ||
      (poData.createdByEmail && poData.createdByEmail.toLowerCase() === actor.email.toLowerCase())
    ) {
      throw new Error(
        'Separation of Duties Violation: Requisition creator cannot authorize Form CS-8 waiver for their own requisition.'
      );
    }

    const now = new Date().toISOString();

    await updateDoc(poRef, {
      status: 'PENDING_APPROVAL', // Release hold, ready for distinct secondary executive approver
      soxHold: false,
      complianceCleared: true,
      complianceWarning: 'Form CS-8 Sole-Source Waiver Authorized (Awaiting Distinct Secondary PO Sign-off)',
      waiverSignedBy: actor.email,
      waiverSignedAt: now,
      waiverJustification: justification,
    });

    await logAuditEvent(orgId, {
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'SOX_WAIVER_AUTHORIZED',
      entityType: 'PURCHASE_ORDER',
      entityId: poId,
      summary: `Form CS-8 Sole-Source Waiver authorized for ${poNumber} by ${actor.email}. Pending distinct secondary sign-off. Reason: ${justification}`,
    });
  } catch (err) {
    throw handleFirestoreError(err, { action: 'update', entityType: 'PurchaseOrder', entityId: poId, orgId });
  }
}

export async function createVendorRecord(
  orgId: string,
  vendorData: Omit<Vendor, 'id' | 'orgId'>,
  actor: { uid: string; email: string; role: UserRole }
): Promise<Vendor> {
  try {
    const id = `vnd-${Date.now().toString(36)}`;
    const newVendor: Vendor = {
      ...vendorData,
      id,
      orgId,
    };

    await setDoc(doc(db, 'organizations', orgId, 'vendors', id), newVendor);

    await logAuditEvent(orgId, {
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'VENDOR_ONBOARDED',
      entityType: 'VENDOR',
      entityId: id,
      summary: `Onboarded vendor ${newVendor.name} (${newVendor.tier}) in category ${newVendor.category}`,
    });

    return newVendor;
  } catch (err) {
    throw handleFirestoreError(err, { action: 'create', entityType: 'Vendor', orgId });
  }
}

export async function updateOrganizationMemberRole(
  orgId: string,
  targetUid: string,
  targetEmail: string,
  newRole: UserRole,
  actor: { uid: string; email: string; role: UserRole }
): Promise<void> {
  // Privilege Escalation Prevention: Users cannot alter their own authorization level
  if (targetUid === actor.uid) {
    throw new Error('Privilege Escalation Blocked: Signatories cannot modify their own authorization level.');
  }

  try {
    const memberRef = doc(db, 'organizations', orgId, 'members', targetUid);
    await updateDoc(memberRef, { role: newRole });

    await logAuditEvent(orgId, {
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'MEMBER_ROLE_CHANGED',
      entityType: 'MEMBER',
      entityId: targetUid,
      summary: `Updated role for ${targetEmail} to ${newRole}`,
    });
  } catch (err) {
    throw handleFirestoreError(err, { action: 'update', entityType: 'OrganizationMember', entityId: targetUid, orgId });
  }
}

export async function inviteOrganizationMember(
  orgId: string,
  inviteEmail: string,
  role: UserRole,
  department: string,
  actor: { uid: string; email: string; role: UserRole }
): Promise<void> {
  try {
    const cleanEmail = inviteEmail.toLowerCase().trim();
    const inviteData = {
      id: cleanEmail,
      orgId,
      email: cleanEmail,
      role,
      department,
      invitedBy: actor.email,
      invitedAt: new Date().toISOString(),
      status: 'PENDING' as const,
    };

    // 1. Store in organization invitations subcollection
    const orgInviteDoc = doc(db, 'organizations', orgId, 'invitations', cleanEmail);
    await setDoc(orgInviteDoc, inviteData);

    // 2. Store in userInvitations registry for tenant claiming
    const userInviteDoc = doc(db, 'userInvitations', cleanEmail);
    await setDoc(userInviteDoc, inviteData);

    await logAuditEvent(orgId, {
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'MEMBER_INVITED',
      entityType: 'MEMBER',
      entityId: cleanEmail,
      summary: `Issued authorized procurement invitation for ${cleanEmail} as ${role} in ${department}`,
    });
  } catch (err) {
    throw handleFirestoreError(err, { action: 'create', entityType: 'OrganizationMember', orgId });
  }
}
