import bcrypt from "bcryptjs";
import { db } from "./db";
import { normalizeBdPhone } from "./sms";
import { ROLES, USER_STATUS, UserStatus } from "./constants/roles";

export interface UserRecord {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  passwordHash: string;
  role: string;
  status: UserStatus;
  divisionId: string | null;
  districtId: string | null;
  upazilaId: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory fallback for local development before live DB is connected
const inMemoryUsers: Map<string, UserRecord> = new Map();

/**
 * Finds a user by normalized Bangladesh phone number.
 */
export async function findUserByPhone(rawPhone: string): Promise<UserRecord | null> {
  const phone = normalizeBdPhone(rawPhone);

  try {
    const user = await db.user.findUnique({
      where: { phone },
    });
    if (user) return user as UserRecord;
  } catch {
    // If DB is not yet connected/migrated, query memory store
  }

  return inMemoryUsers.get(phone) || null;
}

/**
 * Finds a user by email address.
 */
export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  try {
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (user) return user as UserRecord;
  } catch {
    // If DB is not yet connected/migrated, query memory store
  }

  for (const user of inMemoryUsers.values()) {
    if (user.email && user.email.toLowerCase() === normalizedEmail) {
      return user;
    }
  }

  return null;
}

export interface CreateUserInput {
  name: string;
  phone: string;
  email?: string | null;
  password?: string;
  passwordHash?: string;
  divisionId?: string | null;
  districtId?: string | null;
  upazilaId?: string | null;
  address?: string | null;
  status?: UserStatus;
  role?: string;
}

/**
 * Creates a new user in the main User table (only called when verified or direct creation).
 */
export async function createUser(input: CreateUserInput): Promise<UserRecord> {
  const phone = normalizeBdPhone(input.phone);
  const passwordHash =
    input.passwordHash || (input.password ? await bcrypt.hash(input.password, 10) : "");
  const email = input.email ? input.email.trim().toLowerCase() : null;

  const userData = {
    name: input.name.trim(),
    phone,
    email,
    passwordHash,
    role: (input.role as any) || (ROLES.USER as any),
    status: (input.status as any) || (USER_STATUS.ACTIVE as any),
    divisionId: input.divisionId || null,
    districtId: input.districtId || null,
    upazilaId: input.upazilaId || null,
    address: input.address?.trim() || null,
  };

  try {
    const created = await db.user.create({
      data: userData,
    });
    return created as UserRecord;
  } catch {
    // Fallback to memory store if DB is offline
    const record: UserRecord = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryUsers.set(phone, record);
    return record;
  }
}

/**
 * Activates an unverified user account upon successful OTP verification.
 */
export async function activateUser(rawPhone: string): Promise<UserRecord | null> {
  const phone = normalizeBdPhone(rawPhone);

  try {
    const updated = await db.user.update({
      where: { phone },
      data: { status: USER_STATUS.ACTIVE },
    });
    return updated as UserRecord;
  } catch {
    // Fallback in memory
    const existing = inMemoryUsers.get(phone);
    if (!existing) return null;
    existing.status = USER_STATUS.ACTIVE;
    existing.updatedAt = new Date();
    inMemoryUsers.set(phone, existing);
    return existing;
  }
}

/**
 * Clear in-memory users (for testing)
 */
export function _resetMemoryUsers() {
  inMemoryUsers.clear();
}
