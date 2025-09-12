import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://roborescue.somee.com/api/authentication";

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RefreshTokenRequest = await request.json();

    if (!body.refreshToken) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Call the external API to refresh token
    const response = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: body.refreshToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Token refresh failed: ${errorText}` },
        { status: response.status }
      );
    }

    const result: RefreshTokenResponse = await response.json();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Internal server error during token refresh" },
      { status: 500 }
    );
  }
}
