# zkLogin Authentication Implementation

This directory contains the complete zkLogin authentication implementation for the DeFi Quest application.

## Setup Instructions

### 1. Install Dependencies

All required dependencies are already installed:
- `@mysten/sui.js@^0.54.1` - Sui SDK
- `@mysten/zklogin@^0.8.1` - zkLogin SDK
- `jwt-decode` - JWT decoding

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: Add your callback URL (e.g., `http://localhost:3000/auth/callback`)
5. Copy the Client ID

### 3. Environment Variables

Create `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
ZKLOGIN_PROVER_URL=https://prover-dev.mystenlabs.com/v1
```

### 4. Start Development Server

```bash
npm run dev
```

## File Structure

```
frontend/
├── src/
│   ├── types/
│   │   └── zklogin.ts              # TypeScript type definitions
│   ├── lib/
│   │   └── zklogin/
│   │       ├── utils.ts             # Utility functions (nonce, keypair, etc.)
│   │       └── prover.ts            # Prover service integration
│   ├── contexts/
│   │   └── AuthContext.tsx          # React context for auth state
│   ├── hooks/
│   │   └── useZkLogin.ts            # Main zkLogin hook
│   └── components/
│       └── auth/
│           ├── LoginButton.tsx      # Google sign-in button
│           ├── UserAvatar.tsx       # User display component
│           ├── AuthGuard.tsx        # Protected route wrapper
│           └── index.ts             # Barrel export
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── zkproof/
│   │           └── route.ts         # API endpoint for proof generation
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx             # OAuth callback handler
│   └── layout.tsx                   # Root layout with AuthProvider
└── .env.example                     # Environment variables template
```

## Usage Examples

### Basic Login Flow

```tsx
import { LoginButton } from '@/components/auth';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to DeFi Quest</h1>
      <LoginButton />
    </div>
  );
}
```

### Protected Routes

```tsx
import { AuthGuard } from '@/components/auth';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This content requires authentication</div>
    </AuthGuard>
  );
}
```

### Access Auth State

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { address, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Connected: {address}</p>
      ) : (
        <p>Not connected</p>
      )}
    </div>
  );
}
```

### Use zkLogin Hook

```tsx
'use client';

import { useZkLogin } from '@/hooks/useZkLogin';

export default function MyComponent() {
  const { login, logout, address, signTransaction } = useZkLogin();

  const handleSign = async () => {
    const signature = await signTransaction({ /* transaction data */ });
    console.log('Signature:', signature);
  };

  return (
    <div>
      {address ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
```

### Display User Avatar

```tsx
import { UserAvatar } from '@/components/auth';

export default function Header() {
  return (
    <header>
      <UserAvatar showAddress={true} />
    </header>
  );
}
```

## Authentication Flow

1. **User clicks Login Button**
   - Generates ephemeral Ed25519 keypair
   - Creates nonce from public key
   - Redirects to Google OAuth with nonce

2. **Google OAuth Callback**
   - Extracts JWT from URL hash
   - Validates nonce to prevent CSRF
   - Calls Mysten prover service to generate zkLogin proof

3. **zkLogin Proof Generation**
   - Combines JWT + ephemeral public key + randomness
   - Generates zero-knowledge proof
   - Derives Sui address from proof

4. **Session Persistence**
   - Stores session in localStorage
   - Auto-restores on page reload
   - Includes: address, keypair, zkProof, JWT

5. **Transaction Signing** (TODO)
   - Uses ephemeral keypair + zkProof
   - Creates zkLogin signature via `getZkLoginSignature`
   - Submits to Sui network

## Security Considerations

- **Ephemeral Keys**: Stored in localStorage, expire after maxEpoch
- **Nonce Validation**: Prevents CSRF attacks
- **JWT Verification**: Validates issuer, subject, and expiration
- **Proof Generation**: Done via Mysten's trusted prover service
- **Session Storage**: Uses sessionStorage for temporary OAuth data

## Known Limitations

1. **Transaction Signing**: Currently uses placeholder implementation
   - Need to implement `getZkLoginSignature` from `@mysten/zklogin`
   - Requires proper signature aggregation

2. **Address Derivation**: Uses simplified hash-based derivation
   - Production should use actual zkLogin circuit output

3. **Epoch Management**: Uses mock epoch value
   - Should query Sui RPC for actual current epoch

4. **Error Handling**: Basic error states
   - Could add retry logic, better user feedback

## Next Steps

1. Implement proper transaction signing with `getZkLoginSignature`
2. Add Sui RPC client for epoch queries
3. Implement address derivation using @mysten/zklogin utilities
4. Add session refresh mechanism
5. Implement logout on epoch expiration
6. Add unit tests for auth flows

## Troubleshooting

### "NEXT_PUBLIC_GOOGLE_CLIENT_ID not configured"
- Make sure `.env.local` exists with correct Google Client ID

### "Nonce mismatch - possible CSRF attack"
- Clear browser cache and sessionStorage
- Ensure redirect URI matches Google Console configuration

### "Prover service error"
- Check network connection
- Verify ZKLOGIN_PROVER_URL is correct
- Mysten dev prover may have rate limits

### Session not persisting
- Check browser localStorage permissions
- Ensure cookies/storage not blocked
- Try incognito mode to test

## References

- [Sui zkLogin Documentation](https://docs.sui.io/concepts/cryptography/zklogin)
- [Mysten zkLogin SDK](https://www.npmjs.com/package/@mysten/zklogin)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
