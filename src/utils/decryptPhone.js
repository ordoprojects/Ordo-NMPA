// decryptPhone.js
import Aes from 'react-native-aes-crypto';

// Your key from .env:
// const ENCRYPTION_KEY = process.env.PHONE_ENCRYPTION_KEY;
const ENCRYPTION_KEY = 'n3b4o23nvu349ji4n34545jb3bjk3n4k';
console.log("keyy",ENCRYPTION_KEY)
/**
 * Decrypts AES-256-CBC encrypted data.
 * @param {string} cipherTextBase64  - The Base64‑encoded cipher text
 * @param {string} ivBase64          - The Base64‑encoded initialization vector
 * @returns {Promise<string>}        - Returns the decrypted plain text
 */
export async function decryptPhone(cipherTextBase64, ivBase64) {
  try {
    // Note: 'aes‑256‑cbc' requires a 32‑byte key (base64 or hex)
    const decrypted = await Aes.decrypt(cipherTextBase64, ENCRYPTION_KEY, ivBase64, 'aes-256-cbc');
    return decrypted;
  } catch (err) {
    console.error('Phone decryption failed:', err);
    throw err;
  }
}
