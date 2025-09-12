import { NextResponse } from "next/server";
import { compileAndRun } from "@/lib/api/javaCompiler";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const code = formData.get("code") as string;

        const result = await compileAndRun(code);
        return NextResponse.json(result);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unknown error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
