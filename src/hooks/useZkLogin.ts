'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
        throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID not configured');
      }

      // Generate ephemeral keypair
      const { keypair, randomness } = generateEphemeralKeyPair();
      const maxEpoch = await getMaxEpoch();

      // Create nonce
      const publicKeyBytes = keypair.getPublicKey().toBytes();
      const nonce = createNonce(publicKeyBytes, maxEpoch, randomness);

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
  const handleCallback = useCallback(async () => {
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
        throw new Error('Missing temporary authentication data');
      }

      // Validate nonce
      if (!validateNonce(jwt, expectedNonce)) {
        throw new Error('Nonce mismatch - possible CSRF attack');
      }

      // Decode JWT to get user info
      const jwtPayload = decodeJwt(jwt);
      const salt = jwtPayload.sub; // Use sub as salt (in production, use a proper salt)

      // Deserialize keypair
      const keypair = deserializeKeypair(JSON.parse(serializedKeypair));
      const publicKeyBase64 = Buffer.from(keypair.getPublicKey().toBytes()).toString('base64');

      // Generate zkLogin proof
      const zkProof = await generateZkProof({
        jwt,
        ephemeralPublicKey: publicKeyBase64,
        maxEpoch: parseInt(maxEpoch, 10),
        randomness,
        salt,
      });

      // Derive Sui address
      const address = deriveZkLoginAddress(jwt, salt);

      // Create session
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

      // Clean up on error
      sessionStorage.removeItem(TEMP_KEYPAIR_KEY);
      sessionStorage.removeItem(TEMP_NONCE_KEY);
      sessionStorage.removeItem(TEMP_RANDOMNESS_KEY);
      sessionStorage.removeItem(TEMP_MAX_EPOCH_KEY);

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
   * Sign transaction with zkLogin
   * TODO: Implement actual transaction signing
   */
  const signTransaction = useCallback(async (transaction: unknown) => {
    if (!session) {
      throw new Error('Not authenticated');
    }

    try {
      // Deserialize keypair
      const keypair = deserializeKeypair(session.ephemeralKeyPair);

      // In production, this would use getZkLoginSignature from @mysten/zklogin
      // to create a proper zkLogin signature combining the ephemeral signature
      // and the zkProof

      // Placeholder implementation
      console.warn('signTransaction not fully implemented');

      // For now, just sign with ephemeral key (NOT SECURE - for development only)
      const signature = await keypair.signPersonalMessage(
        new TextEncoder().encode(JSON.stringify(transaction))
      );

      return signature;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction signing failed';
      console.error('Sign transaction error:', message);
      throw new Error(message);
    }
  }, [session]);

  // Auto-detect OAuth callback
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if we're on the callback page with JWT in hash
    if (window.location.hash.includes('id_token=') && !session) {
      handleCallback().catch(console.error);
    }
  }, [handleCallback, session]);

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
