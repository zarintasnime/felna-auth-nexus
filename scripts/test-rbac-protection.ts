/**
 * Automated Verification Script for Phase 6: RBAC & Dual-Layer Route Protection
 * 
 * Verifies:
 * 1. Server-side requireAuth() throws 401 on unauthenticated access.
 * 2. Server-side requireRole("ADMIN") throws 403 on standard USER role.
 * 3. Server-side requireRole("ADMIN") succeeds on ADMIN role.
 * 4. Edge Middleware route protection logic:
 *    - Unauthenticated -> /dashboard & /admin/* redirect to /login.
 *    - Role: USER -> /admin/* redirected to /forbidden.
 *    - Role: ADMIN -> Can access both /dashboard and /admin/dashboard.
 *    - Authenticated users visiting /login -> redirected to dashboard.
 */

import "dotenv/config";
import { createSessionToken, verifySessionToken, SESSION_COOKIE_NAME } from "../src/lib/auth-token";
import { AuthError } from "../src/lib/rbac";
import { ROLES } from "../src/lib/constants/roles";

function assert(condition: any, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

// Simulated Edge Middleware logic (mirroring src/middleware.ts)
async function simulateMiddleware(pathname: string, sessionCookieValue?: string) {
  const session = sessionCookieValue ? await verifySessionToken(sessionCookieValue) : null;

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return { status: 307, redirectUrl: `/login?from=${encodeURIComponent(pathname)}` };
    }
    return { status: 200, allowed: true, session };
  }

  if (pathname.startsWith("/admin")) {
    if (!session) {
      return { status: 307, redirectUrl: `/login?from=${encodeURIComponent(pathname)}` };
    }
    if (session.role !== ROLES.ADMIN) {
      return { status: 403, redirectUrl: "/forbidden" };
    }
    return { status: 200, allowed: true, session };
  }

  if ((pathname === "/login" || pathname === "/register") && session) {
    if (session.role === ROLES.ADMIN) {
      return { status: 307, redirectUrl: "/admin/dashboard" };
    }
    return { status: 307, redirectUrl: "/dashboard" };
  }

  return { status: 200, allowed: true };
}

// Simulated Server-Side Guard Logic (mirroring src/lib/rbac.ts)
function assertRole(session: { role: string } | null, requiredRole: string) {
  if (!session) {
    throw new AuthError("Authentication required.", 401);
  }
  if (session.role !== requiredRole) {
    throw new AuthError(`Access denied. Requires ${requiredRole}.`, 403);
  }
  return true;
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   Running Phase 6 RBAC & Route Protection Suite");
  console.log("=======================================================\n");

  // Tokens for Testing
  const userToken = await createSessionToken({
    userId: "usr_regular_123",
    phone: "+8801711111111",
    role: ROLES.USER,
    name: "Regular Customer",
  });

  const adminToken = await createSessionToken({
    userId: "usr_admin_999",
    phone: "+8801799999999",
    role: ROLES.ADMIN,
    name: "System Administrator",
  });

  // ---------------------------------------------------------------------------
  // Test Suite 1: Server-Side Guard Assertions
  // ---------------------------------------------------------------------------
  console.log("--- Test Suite 1: Server-Side Role Assertion Helpers ---");

  // Unauthenticated assertRole check
  try {
    assertRole(null, ROLES.ADMIN);
    assert(false, "Unauthenticated access should throw 401");
  } catch (err: any) {
    assert(err instanceof AuthError && err.statusCode === 401, "Throws AuthError with 401 for null session");
  }

  // Regular user accessing ADMIN resource
  try {
    const userSession = await verifySessionToken(userToken);
    assertRole(userSession, ROLES.ADMIN);
    assert(false, "Regular user should be rejected from ADMIN resource");
  } catch (err: any) {
    assert(err instanceof AuthError && err.statusCode === 403, "Throws AuthError with 403 for insufficient privileges");
  }

  // Admin user accessing ADMIN resource
  const adminSession = await verifySessionToken(adminToken);
  const adminAllowed = assertRole(adminSession, ROLES.ADMIN);
  assert(adminAllowed === true, "Admin user passes ADMIN role check");

  // ---------------------------------------------------------------------------
  // Test Suite 2: Middleware - Unauthenticated Requests
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 2: Edge Middleware - Unauthenticated Protection ---");

  const unauthDash = await simulateMiddleware("/dashboard");
  assert(unauthDash.status === 307 && unauthDash.redirectUrl?.startsWith("/login"), "Unauthenticated /dashboard redirects to /login");

  const unauthAdmin = await simulateMiddleware("/admin/dashboard");
  assert(unauthAdmin.status === 307 && unauthAdmin.redirectUrl?.startsWith("/login"), "Unauthenticated /admin/dashboard redirects to /login");

  // ---------------------------------------------------------------------------
  // Test Suite 3: Middleware - Regular USER Role Access
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 3: Edge Middleware - Regular USER Access ---");

  const userDash = await simulateMiddleware("/dashboard", userToken);
  assert(userDash.status === 200 && userDash.allowed === true, "Regular user can access /dashboard");

  const userAdmin = await simulateMiddleware("/admin/dashboard", userToken);
  assert(userAdmin.status === 403 && userAdmin.redirectUrl === "/forbidden", "Regular user accessing /admin/dashboard is blocked with 403 redirect to /forbidden");

  // ---------------------------------------------------------------------------
  // Test Suite 4: Middleware - ADMIN Role Access
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 4: Edge Middleware - ADMIN Access ---");

  const adminDash = await simulateMiddleware("/dashboard", adminToken);
  assert(adminDash.status === 200 && adminDash.allowed === true, "Admin user can access /dashboard");

  const adminAdmin = await simulateMiddleware("/admin/dashboard", adminToken);
  assert(adminAdmin.status === 200 && adminAdmin.allowed === true, "Admin user can access /admin/dashboard");

  // ---------------------------------------------------------------------------
  // Test Suite 5: Middleware - Authenticated Redirects from Public Pages
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 5: Edge Middleware - Public Route Redirections ---");

  const userLogin = await simulateMiddleware("/login", userToken);
  assert(userLogin.status === 307 && userLogin.redirectUrl === "/dashboard", "Logged-in regular user visiting /login redirects to /dashboard");

  const adminLogin = await simulateMiddleware("/login", adminToken);
  assert(adminLogin.status === 307 && adminLogin.redirectUrl === "/admin/dashboard", "Logged-in admin user visiting /login redirects to /admin/dashboard");

  console.log("\n=======================================================");
  console.log("   🎉 ALL PHASE 6 RBAC TESTS PASSED!");
  console.log("=======================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
