import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Request from "@/models/Request";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();

        const request = await Request.create(data);

        return NextResponse.json({ success: true, data: request }, { status: 201 });
    } catch (error) {
        console.error("Error creating request:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit request" },
            { status: 500 }
        );
    }
}
