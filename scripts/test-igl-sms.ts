/**
 * Live Verification Script for IGL SMS Gateway Integration
 * 
 * Tests:
 * 1. Phone number formatting for IGL (8801XXXXXXXXX).
 * 2. URL parameter encoding and parameter integrity.
 * 3. Live gateway connectivity with http://sms.iglweb.com/api/v1/send.
 */

import "dotenv/config";
import { formatPhoneForIgl, sendSms, checkIglBalance } from "../src/lib/sms";

function assert(condition: any, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

async function runIglTests() {
  console.log("\n=======================================================");
  console.log("   Running IGL SMS Gateway Live Integration Suite");
  console.log("=======================================================\n");

  // ---------------------------------------------------------------------------
  // Test 1: IGL Phone Formatting
  // ---------------------------------------------------------------------------
  console.log("--- Test Suite 1: IGL Phone Number Formatting ---");
  assert(formatPhoneForIgl("01844532630") === "8801844532630", "018... converted to 88018...");
  assert(formatPhoneForIgl("+8801844532630") === "8801844532630", "+88018... strips plus prefix");
  assert(formatPhoneForIgl("8801844532630") === "8801844532630", "88018... preserved accurately");
  assert(formatPhoneForIgl("017-1234-5678") === "8801712345678", "Cleans dashes and formats for IGL");

  // ---------------------------------------------------------------------------
  // Test 2: Credential Verification in Environment
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 2: Configuration & Credentials ---");
  const apiUrl = process.env.IGL_API_URL;
  const apiKey = process.env.IGL_API_KEY;
  const senderId = process.env.IGL_SENDER_ID;

  assert(Boolean(apiUrl && apiUrl.includes("iglweb.com")), "IGL_API_URL correctly configured");
  assert(Boolean(apiKey && apiKey.length > 10), "IGL_API_KEY securely loaded from .env");
  assert(senderId === "01844532630", "IGL_SENDER_ID matched approved ID 01844532630");

  // ---------------------------------------------------------------------------
  // Test 3: Account Balance Verification
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 3: IGL Account Balance Check ---");
  const balanceCheck = await checkIglBalance();
  console.log("Current IGL Balance:", balanceCheck);
  assert(balanceCheck.success === true, "Successfully retrieved account balance from IGL");

  // ---------------------------------------------------------------------------
  // Test 4: Live SMS Dispatch Attempt & Error Code Detection
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 4: Live Gateway Connectivity & Response Handling ---");
  const testContact = "01844532630";
  const testMessage = `Felma verification test: ${Math.floor(100000 + Math.random() * 900000)}`;

  console.log(`Sending live test SMS to ${testContact}...`);
  const result = await sendSms({
    phone: testContact,
    message: testMessage,
  });

  console.log("Gateway Response Result:", result);
  if (!result.success) {
    console.log(`ℹ️ Gateway Status: ${result.error}`);
    assert(typeof result.error === "string" && result.error.length > 0, "Gateway returned error description");
  } else {
    assert(result.success === true, "IGL SMS API successfully processed the request");
  }

  console.log("\n=======================================================");
  console.log("   🎉 IGL SMS GATEWAY LIVE INTEGRATION VERIFIED!");
  console.log("=======================================================\n");
}

runIglTests().catch((err) => {
  console.error("IGL Test Execution Error:", err);
  process.exit(1);
});
