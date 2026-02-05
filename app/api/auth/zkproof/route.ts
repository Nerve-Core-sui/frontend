// API route for zkLogin proof generation
import { NextRequest, NextResponse } from 'next/server';

const PROVER_URL = process.env.ZKLOGIN_PROVER_URL || 'https://prover-dev.mystenlabs.com/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { jwt, ephemeralPublicKey, maxEpoch, randomness, salt } = body;

    // Validate required fields
    if (!jwt || !ephemeralPublicKey || !maxEpoch || !randomness || !salt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call Mysten prover service
    const response = await fetch(`${PROVER_URL}/prove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jwt,
        ephemeralPublicKey,
        maxEpoch,
        randomness,
        salt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Prover service error:', errorText);
      return NextResponse.json(
        { error: `Prover service failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({ proof: data.proof });
  } catch (error) {
    console.error('zkProof API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
