// zkLogin utility functions
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { generateNonce, generateRandomness } from '@mysten/zklogin';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload, GoogleOAuthConfig } from '@/types/zklogin';

const MAX_EPOCH = 10; // Epochs until ephemeral key expires

/**
 * Generate ephemeral Ed25519 keypair for zkLogin
 */
export function generateEphemeralKeyPair(): { keypair: Ed25519Keypair; randomness: string } {
  const randomness = generateRandomness();
  const keypair = Ed25519Keypair.fromSecretKey(randomness);

  return { keypair, randomness: Buffer.from(randomness).toString('base64') };
}

/**
 * Create nonce from ephemeral public key
 */
export function createNonce(publicKey: Uint8Array, maxEpoch: number, randomness: string): string {
  const nonce = generateNonce(
    publicKey,
    maxEpoch,
    Buffer.from(randomness, 'base64')
  );
  return nonce;
}

/**
 * Get Google OAuth URL with nonce
 */
export function getGoogleOAuthUrl(config: GoogleOAuthConfig): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce: config.nonce,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Extract JWT from OAuth redirect hash
 */
export function extractJwtFromHash(hash: string): string | null {
  const params = new URLSearchParams(hash.slice(1)); // Remove # prefix
  return params.get('id_token');
}

/**
 * Decode and validate JWT
 */
export function decodeJwt(jwt: string): JWTPayload {
  const decoded = jwtDecode<JWTPayload>(jwt);

  // Basic validation
  if (!decoded.sub || !decoded.iss || !decoded.nonce) {
    throw new Error('Invalid JWT: missing required claims');
  }

  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < now) {
    throw new Error('JWT expired');
  }

  return decoded;
}

/**
 * Derive Sui address from JWT and ephemeral public key
 * This is a simplified version - actual implementation needs zkLogin circuit
 */
export function deriveZkLoginAddress(jwt: string, salt: string): string {
  const decoded = decodeJwt(jwt);

  // In production, this would use the zkLogin circuit to derive the address
  // For now, we'll use a deterministic hash of sub + iss + salt
  const addressInput = `${decoded.sub}:${decoded.iss}:${salt}`;
  const hash = Buffer.from(addressInput).toString('base64');

  // This is a placeholder - actual zkLogin address derivation is done by @mysten/zklogin
  return `0x${hash.slice(0, 64)}`;
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Validate nonce in JWT matches expected nonce
 */
export function validateNonce(jwt: string, expectedNonce: string): boolean {
  const decoded = decodeJwt(jwt);
  return decoded.nonce === expectedNonce;
}

/**
 * Get current epoch (mock implementation - replace with actual Sui RPC call)
 */
export async function getCurrentEpoch(): Promise<number> {
  // TODO: Replace with actual Sui RPC call to get current epoch
  return 100; // Mock value
}

/**
 * Calculate max epoch for ephemeral key
 */
export async function getMaxEpoch(): Promise<number> {
  const currentEpoch = await getCurrentEpoch();
  return currentEpoch + MAX_EPOCH;
}

/**
 * Serialize keypair for storage
 */
export function serializeKeypair(keypair: Ed25519Keypair): {
  privateKey: string;
  publicKey: string;
} {
  return {
    privateKey: Buffer.from(keypair.getSecretKey()).toString('base64'),
    publicKey: Buffer.from(keypair.getPublicKey().toBytes()).toString('base64'),
  };
}

/**
 * Deserialize keypair from storage
 */
export function deserializeKeypair(serialized: {
  privateKey: string;
  publicKey: string;
}): Ed25519Keypair {
  const privateKeyBytes = Buffer.from(serialized.privateKey, 'base64');
  return Ed25519Keypair.fromSecretKey(privateKeyBytes);
}
