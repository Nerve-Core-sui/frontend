// zkLogin TypeScript type definitions

export interface EphemeralKeyPair {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}

export interface ZkProof {
  proofPoints: {
    a: string[];
    b: string[][];
    c: string[];
  };
  issBase64Details: {
    value: string;
    indexMod4: number;
  };
  headerBase64: string;
}

export interface JWTPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  nonce: string;
  email?: string;
  email_verified?: boolean;
}

export interface AuthSession {
  address: string;
  ephemeralKeyPair: {
    privateKey: string; // base64 encoded
    publicKey: string; // base64 encoded
  };
  zkProof: ZkProof | null;
  jwt: string;
  maxEpoch: number;
  randomness: string;
  isAuthenticated: boolean;
}

export interface ZkLoginState {
  address: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ProverResponse {
  proof: ZkProof;
}

export interface GoogleOAuthConfig {
  clientId: string;
  redirectUri: string;
  nonce: string;
}
