// zkLogin utility functions
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui/keypairs/ed25519';
import {
  generateNonce,
  generateRandomness,
  jwtToAddress,
  getExtendedEphemeralPublicKey,
} from '@mysten/sui/zklogin';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload, GoogleOAuthConfig } from '@/types/zklogin';
import { suiClient } from '@/lib/sui-client';

const MAX_EPOCH = 10; // Epochs until ephemeral key expires

// Hardcoded dev salt — same Google account always maps to same Sui address
// NOT suitable for production (address can be linked to Google identity)
export const ZK_LOGIN_SALT = '12345678901234567890';

/**
 * Generate ephemeral Ed25519 keypair for zkLogin
 */
export function generateEphemeralKeyPair(): { keypair: Ed25519Keypair; randomness: string } {
  const randomness = generateRandomness();
  const keypair = new Ed25519Keypair();
  return { keypair, randomness };
}

/**
 * Create nonce from ephemeral public key
 */
export function createNonce(publicKey: Ed25519PublicKey, maxEpoch: number, randomness: string): string {
  return generateNonce(publicKey, maxEpoch, randomness);
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

  if (!decoded.sub || !decoded.iss || !decoded.nonce) {
    throw new Error('Invalid JWT: missing required claims');
  }

  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < now) {
    throw new Error('JWT expired');
  }

  return decoded;
}

/**
 * Derive Sui address from JWT using real zkLogin address derivation
 */
export function deriveZkLoginAddress(jwt: string, salt: string): string {
  return jwtToAddress(jwt, BigInt(salt), false);
}

/**
 * Get extended ephemeral public key for prover
 */
export function getExtendedEphemeralPubKey(keypair: Ed25519Keypair): string {
  return getExtendedEphemeralPublicKey(keypair.getPublicKey());
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
 * Get current epoch from Sui network
 */
export async function getCurrentEpoch(): Promise<number> {
  const state = await suiClient.getLatestSuiSystemState();
  return Number(state.epoch);
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
    privateKey: keypair.getSecretKey(),
    publicKey: keypair.getPublicKey().toBase64(),
  };
}

/**
 * Deserialize keypair from storage
 */
export function deserializeKeypair(serialized: {
  privateKey: string;
  publicKey: string;
}): Ed25519Keypair {
  return Ed25519Keypair.fromSecretKey(serialized.privateKey);
}
