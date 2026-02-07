'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getZkLoginSignature } from '@mysten/sui/zklogin';
import {
  generateEphemeralKeyPair,
  createNonce,
  getGoogleOAuthUrl,
  extractJwtFromHash,
  decodeJwt,
  validateNonce,
  getMaxEpoch,
  serializeKeypair,
  deserializeKeypair,
  deriveZkLoginAddress,
  deriveAddressFromSeed,
  getExtendedEphemeralPubKey,
  computeAddressSeed,
  ZK_LOGIN_SALT,
} from '@/lib/zklogin/utils';
import { generateZkProof } from '@/lib/zklogin/prover';
import { AuthSession } from '@/types/zklogin';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/auth/callback';
const TEMP_KEYPAIR_KEY = 'zklogin_temp_keypair';
const TEMP_NONCE_KEY = 'zklogin_temp_nonce';
const TEMP_RANDOMNESS_KEY = 'zklogin_temp_randomness';
const TEMP_MAX_EPOCH_KEY = 'zklogin_temp_max_epoch';

export function useZkLogin() {
  const { session, setSession, clearSession } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initiate Google OAuth flow
   */
  const login = useCallback(async () => {
    try {
      setIsProcessing(true);
      setError(null);

      if (!GOOGLE_CLIENT_ID) {
        throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID not configured. Please set it in .env.local');
      }

      // Generate ephemeral keypair
      const { keypair, randomness } = generateEphemeralKeyPair();
      const maxEpoch = await getMaxEpoch();

      // Create nonce
      const publicKey = keypair.getPublicKey();
      const nonce = createNonce(publicKey, maxEpoch, randomness);

      // Store temporary data for callback
      const serialized = serializeKeypair(keypair);
      sessionStorage.setItem(TEMP_KEYPAIR_KEY, JSON.stringify(serialized));
      sessionStorage.setItem(TEMP_NONCE_KEY, nonce);
      sessionStorage.setItem(TEMP_RANDOMNESS_KEY, randomness);
      sessionStorage.setItem(TEMP_MAX_EPOCH_KEY, String(maxEpoch));

      // Redirect to Google OAuth
      const oauthUrl = getGoogleOAuthUrl({
        clientId: GOOGLE_CLIENT_ID,
        redirectUri: REDIRECT_URI,
        nonce,
      });

      window.location.href = oauthUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      console.error('Login error:', message);
      setError(message);
      setIsProcessing(false);
    }
  }, []);

  /**
   * Handle OAuth callback (extract JWT and generate proof)
   */
  const handleCallback = useCallback(async (): Promise<AuthSession> => {
    try {
      setIsProcessing(true);
      setError(null);

      // Extract JWT from URL hash
      const jwt = extractJwtFromHash(window.location.hash);
      if (!jwt) {
        throw new Error('No JWT found in OAuth callback');
      }

      // Retrieve temporary data
      const serializedKeypair = sessionStorage.getItem(TEMP_KEYPAIR_KEY);
      const expectedNonce = sessionStorage.getItem(TEMP_NONCE_KEY);
      const randomness = sessionStorage.getItem(TEMP_RANDOMNESS_KEY);
      const maxEpoch = sessionStorage.getItem(TEMP_MAX_EPOCH_KEY);

      if (!serializedKeypair || !expectedNonce || !randomness || !maxEpoch) {
        throw new Error('Missing temporary authentication data. Please try logging in again.');
      }

      // Validate nonce
      if (!validateNonce(jwt, expectedNonce)) {
        throw new Error('Nonce mismatch - possible CSRF attack');
      }

      // Decode JWT to get user info
      const decodedJwt = decodeJwt(jwt);

      // Deserialize keypair and get extended ephemeral public key
      const keypair = deserializeKeypair(JSON.parse(serializedKeypair));
      const extendedEphemeralPublicKey = getExtendedEphemeralPubKey(keypair);

      // Try to generate zkLogin proof (prover may be down)
      let zkProof = null;
      try {
        zkProof = await generateZkProof({
          jwt,
          ephemeralPublicKey: extendedEphemeralPublicKey,
          maxEpoch: parseInt(maxEpoch, 10),
          randomness,
          salt: ZK_LOGIN_SALT,
        });
        console.log('ZK proof generated, addressSeed:', zkProof.addressSeed ? 'present' : 'absent');
      } catch (proverErr) {
        console.warn('ZK proof generation failed (prover may be down). Login will proceed without proof.', proverErr);
      }

      // Derive Sui address:
      // - If Enoki returned addressSeed, use it (consistent with the proof)
      // - Otherwise fall back to local derivation with hardcoded salt
      let address: string;
      if (zkProof?.addressSeed) {
        address = deriveAddressFromSeed(zkProof.addressSeed, decodedJwt.iss);
        console.log('Address derived from Enoki addressSeed:', address);
      } else {
        address = deriveZkLoginAddress(jwt, ZK_LOGIN_SALT);
        console.log('Address derived from local salt (fallback):', address);
      }

      // Create session (with or without proof)
      const newSession: AuthSession = {
        address,
        ephemeralKeyPair: JSON.parse(serializedKeypair),
        zkProof,
        jwt,
        maxEpoch: parseInt(maxEpoch, 10),
        randomness,
        isAuthenticated: true,
      };

      setSession(newSession);

      // Clean up temporary data
      sessionStorage.removeItem(TEMP_KEYPAIR_KEY);
      sessionStorage.removeItem(TEMP_NONCE_KEY);
      sessionStorage.removeItem(TEMP_RANDOMNESS_KEY);
      sessionStorage.removeItem(TEMP_MAX_EPOCH_KEY);

      // Clear hash from URL
      window.history.replaceState({}, document.title, window.location.pathname);

      setIsProcessing(false);
      return newSession;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Callback handling failed';
      console.error('Callback error:', message);
      setError(message);
      setIsProcessing(false);

      // Clean up on non-retryable errors
      if (message.includes('Nonce mismatch') || message.includes('Missing temporary')) {
        sessionStorage.removeItem(TEMP_KEYPAIR_KEY);
        sessionStorage.removeItem(TEMP_NONCE_KEY);
        sessionStorage.removeItem(TEMP_RANDOMNESS_KEY);
        sessionStorage.removeItem(TEMP_MAX_EPOCH_KEY);
      }

      throw err;
    }
  }, [setSession]);

  /**
   * Logout and clear session
   */
  const logout = useCallback(() => {
    clearSession();
    setError(null);
  }, [clearSession]);

  /**
   * Get current Sui address
   */
  const getAddress = useCallback((): string | null => {
    return session?.address || null;
  }, [session]);

  /**
   * Sign transaction bytes with zkLogin
   * Combines ephemeral signature with ZK proof to create a valid zkLogin signature
   */
  const signTransaction = useCallback(async (txBytes: Uint8Array): Promise<string> => {
    if (!session) {
      throw new Error('Not authenticated');
    }
    if (!session.zkProof) {
      throw new Error('No ZK proof available');
    }

    try {
      const keypair = deserializeKeypair(session.ephemeralKeyPair);

      // Sign the transaction bytes with the ephemeral keypair
      const { signature: ephemeralSignature } = await keypair.signTransaction(txBytes);

      // Combine with ZK proof to create zkLogin signature
      // Prefer addressSeed from prover response (Enoki returns it), fall back to local computation
      const addressSeed = session.zkProof.addressSeed || computeAddressSeed(session.jwt, ZK_LOGIN_SALT);
      console.log('signTransaction addressSeed:', addressSeed.slice(0, 20) + '...', session.zkProof.addressSeed ? '(from prover)' : '(locally computed)');
      const zkLoginSignature = getZkLoginSignature({
        inputs: {
          ...session.zkProof,
          addressSeed,
        },
        maxEpoch: session.maxEpoch,
        userSignature: ephemeralSignature,
      });

      return zkLoginSignature;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction signing failed';
      console.error('Sign transaction error:', message);
      throw new Error(message);
    }
  }, [session]);

  return {
    isAuthenticated: session?.isAuthenticated || false,
    address: session?.address || null,
    isProcessing,
    error,
    login,
    logout,
    getAddress,
    signTransaction,
    handleCallback,
  };
}
