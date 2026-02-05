// zkLogin prover service integration
import { ZkProof } from '@/types/zklogin';

const PROVER_URL = process.env.NEXT_PUBLIC_ZKLOGIN_PROVER_URL || 'https://prover-dev.mystenlabs.com/v1';

export interface GenerateProofParams {
  jwt: string;
  ephemeralPublicKey: string;
  maxEpoch: number;
  randomness: string;
  salt: string;
}

/**
 * Generate zkLogin proof via Mysten prover service
 */
export async function generateZkProof(params: GenerateProofParams): Promise<ZkProof> {
  try {
    const response = await fetch(`${PROVER_URL}/prove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jwt: params.jwt,
        ephemeralPublicKey: params.ephemeralPublicKey,
        maxEpoch: params.maxEpoch,
        randomness: params.randomness,
        salt: params.salt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Prover service error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.proof as ZkProof;
  } catch (error) {
    console.error('Failed to generate zkLogin proof:', error);
    throw new Error(`zkLogin proof generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Request proof via our Next.js API route (for server-side proxying if needed)
 */
export async function requestProofViaApi(params: GenerateProofParams): Promise<ZkProof> {
  try {
    const response = await fetch('/api/auth/zkproof', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Proof generation failed');
    }

    const data = await response.json();
    return data.proof as ZkProof;
  } catch (error) {
    console.error('Failed to request proof via API:', error);
    throw new Error(`API proof request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
