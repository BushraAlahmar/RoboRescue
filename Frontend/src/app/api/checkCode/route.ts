import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, levelId, code, lang } = body;

    // Validate required parameters
    if (!userId || !levelId || !code) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required parameters: userId, levelId, and code are required",
        },
        { status: 400 }
      );
    }

    // Send request to external API
    const response = await fetch(
      "https://roborescue.somee.com/api/checkCode/checkCode",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          levelId,
          code,
          lang
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          error: errorData, // Return the error data directly (could be array or object)
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
