import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/app/[locale]/api-services";

interface UpdatePasswordBody {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<UpdatePasswordBody>;
    const { userId, oldPassword, newPassword } = body;

    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "userId, oldPassword and newPassword are required",
        },
        { status: 400 }
      );
    }

    const authorization = request.headers.get("authorization");

    const response = await fetch(`${BASE_URL}/password/updatePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: JSON.stringify({ userId, oldPassword, newPassword }),
    });

    const contentType = response.headers.get("content-type");
    const result = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: result },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
