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

// User Profile Operations
export async function getOrCreateUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}): Promise<{ profile: UserProfile; organization: Organization; member: OrganizationMember }> {
  try {
    const userRef = doc(db, 'userProfiles', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const profile = userSnap.data() as UserProfile;
      const orgRef = doc(db, 'organizations', profile.currentOrgId);
      const orgSnap = await getDoc(orgRef);
      const organization = orgSnap.exists()
        ? (orgSnap.data() as Organization)
        : await createDefaultOrganization(user.uid, user.email || 'user@synthetix.corp');

      const memberRef = doc(db, 'organizations', organization.id, 'members', user.uid);
      const memberSnap = await getDoc(memberRef);
      let member: OrganizationMember;
      if (memberSnap.exists()) {
        member = memberSnap.data() as OrganizationMember;
      } else {
        member = {
          uid: user.uid,
          orgId: organization.id,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Procurement Specialist',
          role: 'ADMIN',
          department: 'Executive Sourcing',
          joinedAt: new Date().toISOString(),
        };
        await setDoc(memberRef, member);
      }

      return { profile, organization, member };
    }

    // New User Setup
    const defaultOrgId = 'org-synthetix-enterprise';
    const organization = await getOrCreateDefaultOrg(defaultOrgId, user.uid);

    const member: OrganizationMember = {
      uid: user.uid,
      orgId: defaultOrgId,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Enterprise Lead',
      role: 'ADMIN',
      department: 'Global Sourcing & Supply Chain',
      joinedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'organizations', defaultOrgId, 'members', user.uid), member);

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Enterprise Lead',
      photoURL: user.photoURL || undefined,
      currentOrgId: defaultOrgId,
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

async function getOrCreateDefaultOrg(orgId: string, ownerUid: string): Promise<Organization> {
  const orgRef = doc(db, 'organizations', orgId);
  const orgSnap = await getDoc(orgRef);

  if (orgSnap.exists()) {
    return orgSnap.data() as Organization;
  }

  const defaultOrg: Organization = {
    id: orgId,
    name: 'Synthetix Global Procurement Corp',
    slug: 'synthetix-global',
    defaultCurrency: 'USD',
    soxComplianceEnabled: true,
    soxThresholdUSD: 250000,
    createdAt: new Date().toISOString(),
    ownerUid: ownerUid,
  };

  await setDoc(orgRef, defaultOrg);

  // Seed default dataset for this organization
  await seedInitialOrganizationData(orgId, ownerUid);

  return defaultOrg;
}

async function createDefaultOrganization(ownerUid: string, email: string): Promise<Organization> {
  const orgId = `org-${Date.now().toString(36)}`;
  const defaultOrg: Organization = {
    id: orgId,
    name: 'Synthetix Strategic Operations',
    slug: 'synthetix-ops',
    defaultCurrency: 'USD',
    soxComplianceEnabled: true,
    soxThresholdUSD: 250000,
    createdAt: new Date().toISOString(),
    ownerUid: ownerUid,
  };

  await setDoc(doc(db, 'organizations', orgId), defaultOrg);
  await seedInitialOrganizationData(orgId, ownerUid);
  return defaultOrg;
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
        ? 'SOX Sec 404: Exceeds $250k single-source delegation limit. Requires Form CS-8 waiver.'
        : undefined,
      complianceCleared: !isSoxFlagged,
      soxHold: isSoxFlagged,
    };

    const poRef = doc(db, 'organizations', orgId, 'pos', poId);
    batch.set(poRef, newPo);

    await batch.commit();

    // 3. Log Audit Trail
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
    const now = new Date().toISOString();

    await updateDoc(poRef, {
      status: 'APPROVED',
      soxHold: false,
      complianceCleared: true,
      complianceWarning: 'Form CS-8 Sole-Source Waiver Authorized by Finance Audit Committee',
      waiverSignedBy: actor.email,
      waiverSignedAt: now,
      waiverJustification: justification,
      approvedBy: actor.email,
      approvedAt: now,
    });

    await logAuditEvent(orgId, {
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'SOX_WAIVER_AUTHORIZED',
      entityType: 'PURCHASE_ORDER',
      entityId: poId,
      summary: `Form CS-8 Sole-Source Waiver signed for ${poNumber} by ${actor.email}. Reason: ${justification}`,
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
    const pseudoUid = `invited-${inviteEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const memberDoc = doc(db, 'organizations', orgId, 'members', pseudoUid);

    await setDoc(memberDoc, {
      uid: pseudoUid,
      orgId,
      email: inviteEmail,
      displayName: inviteEmail.split('@')[0],
      role,
      department,
      joinedAt: new Date().toISOString(),
    });

    await logAuditEvent(orgId, {
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'MEMBER_INVITED',
      entityType: 'MEMBER',
      entityId: pseudoUid,
      summary: `Invited ${inviteEmail} as ${role} in ${department}`,
    });
  } catch (err) {
    throw handleFirestoreError(err, { action: 'create', entityType: 'OrganizationMember', orgId });
  }
}
