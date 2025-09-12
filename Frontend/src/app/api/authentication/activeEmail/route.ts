import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://roborescue.somee.com/api/authentication";

export interface EmailActivationRequest {
  email: string;
  token: string;
}

export interface EmailActivationResponse {
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailActivationRequest = await request.json();

    if (!body.email || !body.token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      );
    }

    if (body.token.length !== 8) {
      return NextResponse.json(
        { error: "Token must be 8 characters long" },
        { status: 400 }
      );
    }

    // Call the external API
    const response = await fetch(`${BASE_URL}/activeEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        token: body.token,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Activation failed: ${errorText}` },
        { status: response.status }
      );
    }

    const result: EmailActivationResponse = await response.json();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Email activation error:", error);
    return NextResponse.json(
      { error: "Internal server error during email activation" },
      { status: 500 }
    );
  }
}
