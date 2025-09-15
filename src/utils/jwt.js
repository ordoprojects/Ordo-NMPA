import { Buffer } from 'buffer';
import Config from 'react-native-config';

global.Buffer = Buffer; // Polyfill

export const verifyToken = (token) => {
  try {
    // 1. Basic structure validation
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) {
      throw new Error('Invalid JWT structure');
    }

    // 2. Decode without verification (for basic claims)
    const decodedPayload = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf8')
    );

    // 3. Manual expiration check
    if (decodedPayload.exp && decodedPayload.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }

    return decodedPayload;

  } catch (error) {
    console.error('JWT Error:', error.message);
    return null;
  }
};