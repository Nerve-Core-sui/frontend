// zkLogin prover service integration
import { ZkProof } from '@/types/zklogin';

const ENOKI_API_KEY = process.env.NEXT_PUBLIC_ENOKI_API_KEY || '';
const ENOKI_BASE_URL = 'https://api.enoki.mystenlabs.com';

// Fallback raw Mysten provers
const RAW_PROVER_URLS = [
  'https://prover-dev.mystenlabs.com/v1',
  process.env.NEXT_PUBLIC_ZKLOGIN_PROVER_URL || 'https://prover.mystenlabs.com/v1',
];

export interface GenerateProofParams {
  jwt: string;
  ephemeralPublicKey: string;
  maxEpoch: number;
  randomness: string;
  salt: string;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Try Enoki API for ZK proof generation.
 * Enoki returns addressSeed in the response, ensuring consistency.
 */
async function tryEnokiProver(params: GenerateProofParams): Promise<ZkProof> {
  const network = (process.env.NEXT_PUBLIC_NETWORK as string) || 'testnet';

  const response = await fetch(`${ENOKI_BASE_URL}/v1/zklogin/zkp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENOKI_API_KEY}`,
      'zklogin-jwt': params.jwt,
    },
    body: JSON.stringify({
      ephemeralPublicKey: params.ephemeralPublicKey,
      maxEpoch: params.maxEpoch,
      randomness: params.randomness,
      network,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Enoki prover ${response.status}: ${errorText.slice(0, 200)}`);
  }

  const result = await response.json();
  const data = result.data || result;

  console.log('Enoki proof response keys:', Object.keys(data));

  return {
    proofPoints: data.proofPoints,
    issBase64Details: data.issBase64Details,
    headerBase64: data.headerBase64,
    addressSeed: data.addressSeed,
  };
}

/**
 * Try raw Mysten prover as fallback.
 */
async function tryRawProver(url: string, params: GenerateProofParams): Promise<ZkProof> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jwt: params.jwt,
      extendedEphemeralPublicKey: params.ephemeralPublicKey,
      maxEpoch: String(params.maxEpoch),
      jwtRandomness: params.randomness,
      salt: params.salt,
      keyClaimName: 'sub',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Prover ${response.status}: ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();
  console.log('Raw prover response keys:', Object.keys(data));

  return {
    proofPoints: data.proofPoints,
    issBase64Details: data.issBase64Details,
    headerBase64: data.headerBase64,
    addressSeed: data.addressSeed, // capture if returned
  };
}

/**
 * Generate zkLogin proof.
 * Uses Enoki API if API key is configured, otherwise falls back to raw Mysten prover.
 */
export async function generateZkProof(params: GenerateProofParams): Promise<ZkProof> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  // Try Enoki first if API key is available
  if (ENOKI_API_KEY) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) await sleep(3000 * attempt);
        console.log(`Trying Enoki prover (attempt ${attempt + 1}/${maxRetries})`);
        const proof = await tryEnokiProver(params);
        console.log('ZK proof generated via Enoki', proof.addressSeed ? '(addressSeed included)' : '');
        return proof;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Enoki prover error (attempt ${attempt + 1}):`, lastError.message);
        if (lastError.message.includes('401') || lastError.message.includes('403')) {
          console.warn('Enoki API key invalid, falling back to raw prover');
          break;
        }
      }
    }
  }

  // Fallback to raw Mysten provers
  for (const proverUrl of RAW_PROVER_URLS) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) await sleep(6000 * attempt);
        console.log(`Trying prover: ${proverUrl} (attempt ${attempt + 1}/${maxRetries})`);
        const proof = await tryRawProver(proverUrl, params);
        console.log('ZK proof generated successfully', proof.addressSeed ? '(addressSeed included)' : '');
        return proof;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        const msg = lastError.message;

        if (msg.includes('429')) {
          console.warn(`Prover rate limited, waiting...`);
          continue;
        }
        if (msg.includes('500')) {
          console.warn(`Prover server error, retrying...`);
          continue;
        }
        if (msg.includes('400')) {
          console.warn(`Prover rejected request: ${msg}`);
          break;
        }
        console.warn(`Prover error:`, msg);
        continue;
      }
    }
    console.warn(`All retries exhausted for ${proverUrl}`);
  }

  throw new Error(`zkLogin proof generation failed: ${lastError?.message || 'All provers unavailable'}`);
}
