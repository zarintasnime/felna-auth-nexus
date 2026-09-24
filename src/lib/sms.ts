/**
 * IGL SMS Gateway Integration Boilerplate
 * 
 * Responsible for dispatching OTPs and transactional SMS to Bangladesh phone numbers.
 */

export interface SendSmsParams {
  phone: string;
  message: string;
}

export interface SmsResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendSms({ phone, message }: SendSmsParams): Promise<SmsResponse> {
  const apiKey = process.env.IGL_API_KEY;

  if (!apiKey) {
    console.warn("[IGL SMS] IGL_API_KEY not configured. Running in mock mode.");
    console.log(`[IGL SMS MOCK] To: ${phone} | Content: ${message}`);
    return { success: true, messageId: "mock_msg_id" };
  }

  // Implementation will call IGL SMS API in Phase 3
  return { success: true };
}

export function generateOtp(length: number = 6): string {
  // In Phase 3: will use crypto.randomInt
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}
