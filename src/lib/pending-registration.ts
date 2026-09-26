import { db } from "./db";
import { normalizeBdPhone } from "./sms";

export interface PendingRegistrationData {
  name: string;
  phone: string;
  email: string;
  passwordHash: string;
  divisionId?: string | null;
  districtId?: string | null;
  upazilaId?: string | null;
  address?: string | null;
}

export interface PendingRegistrationRecord extends PendingRegistrationData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory fallback map for offline development and unit tests
const inMemoryPendingRegistrations: Map<string, PendingRegistrationRecord> = new Map();

/**
 * Saves or updates a pending registration payload temporarily.
 * Data is held here and NEVER inserted into the main User table until OTP verification.
 */
export async function savePendingRegistration(
  data: PendingRegistrationData
): Promise<PendingRegistrationRecord> {
  const normalizedPhone = normalizeBdPhone(data.phone);
  const normalizedEmail = data.email.trim().toLowerCase();

  const payload = {
    name: data.name.trim(),
    phone: normalizedPhone,
    email: normalizedEmail,
    passwordHash: data.passwordHash,
    divisionId: data.divisionId || null,
    districtId: data.districtId || null,
    upazilaId: data.upazilaId || null,
    address: data.address?.trim() || null,
  };

  try {
    // If pendingRegistration table exists in Prisma
    const record = await (db as any).pendingRegistration.upsert({
      where: { phone: normalizedPhone },
      create: payload,
      update: {
        ...payload,
        updatedAt: new Date(),
      },
    });
    return record as PendingRegistrationRecord;
  } catch (err) {
    // Fallback to in-memory store
    const existing = inMemoryPendingRegistrations.get(normalizedPhone);
    const now = new Date();
    const record: PendingRegistrationRecord = {
      id: existing ? existing.id : `pending_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...payload,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };
    inMemoryPendingRegistrations.set(normalizedPhone, record);
    return record;
  }
}

/**
 * Finds a pending registration by normalized phone number.
 */
export async function findPendingRegistrationByPhone(
  rawPhone: string
): Promise<PendingRegistrationRecord | null> {
  const phone = normalizeBdPhone(rawPhone);

  try {
    const record = await (db as any).pendingRegistration.findUnique({
      where: { phone },
    });
    if (record) return record as PendingRegistrationRecord;
  } catch {
    // DB offline/unmigrated fallback
  }

  return inMemoryPendingRegistrations.get(phone) || null;
}

/**
 * Finds a pending registration by email.
 */
export async function findPendingRegistrationByEmail(
  email: string
): Promise<PendingRegistrationRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  try {
    const record = await (db as any).pendingRegistration.findFirst({
      where: { email: normalizedEmail },
    });
    if (record) return record as PendingRegistrationRecord;
  } catch {
    // DB offline/unmigrated fallback
  }

  for (const item of inMemoryPendingRegistrations.values()) {
    if (item.email && item.email.toLowerCase() === normalizedEmail) {
      return item;
    }
  }

  return null;
}

/**
 * Deletes a pending registration after successful OTP verification and User table insertion.
 */
export async function deletePendingRegistration(rawPhone: string): Promise<void> {
  const phone = normalizeBdPhone(rawPhone);

  try {
    await (db as any).pendingRegistration.deleteMany({
      where: { phone },
    });
  } catch {
    // DB offline/unmigrated fallback
  }

  inMemoryPendingRegistrations.delete(phone);
}

/**
 * Reset memory store (used by test runners)
 */
export function _resetMemoryPendingRegistrations() {
  inMemoryPendingRegistrations.clear();
}
