import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/app/[locale]/api-services";

interface AskForPasswordTokenBody {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<AskForPasswordTokenBody>;
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "email is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BASE_URL}/password/askForPasswordToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const contentType = response.headers.get("content-type");
    let resultBoolean = false;
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      resultBoolean = Boolean(result === true || (result && result.success));
    } else {
      const text = await response.text();
      resultBoolean = text.trim().toLowerCase() === "true";
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: resultBoolean },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, data: resultBoolean },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
