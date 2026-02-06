// zkLogin prover service integration
import { ZkProof } from '@/types/zklogin';

const PROVER_URL = process.env.NEXT_PUBLIC_ZKLOGIN_PROVER_URL || 'https://prover-dev.mystenlabs.com/v1';

export interface GenerateProofParams {
  jwt: string;
  ephemeralPublicKey: string; // Extended ephemeral public key from getExtendedEphemeralPublicKey
  maxEpoch: number;
  randomness: string;
  salt: string;
}

/**
 * Generate zkLogin proof via Mysten prover service
 * The prover URL should be the base URL (e.g. https://prover-dev.mystenlabs.com/v1)
 * The POST goes directly to this URL, not to /prove
 */
export async function generateZkProof(params: GenerateProofParams): Promise<ZkProof> {
  try {
    const response = await fetch(PROVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jwt: params.jwt,
        extendedEphemeralPublicKey: params.ephemeralPublicKey,
        maxEpoch: params.maxEpoch,
        jwtRandomness: params.randomness,
        salt: params.salt,
        keyClaimName: 'sub',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Prover service error: ${response.status} - ${errorText}`);
    }

    // The prover returns the proof directly, not wrapped in { proof: ... }
    const proof = await response.json();
    return proof as ZkProof;
  } catch (error) {
    console.error('Failed to generate zkLogin proof:', error);
    throw new Error(`zkLogin proof generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
