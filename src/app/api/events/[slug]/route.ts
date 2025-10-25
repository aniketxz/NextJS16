import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import { Event, IEvent } from "@/src/database";

type RouteParams = {
	params: Promise<{ slug: string }>;
};

export async function GET(
	req: NextRequest,
	{ params }: RouteParams
): Promise<NextResponse> {
	try {
		await connectDB();

		const { slug } = await params;

		if (!slug || typeof slug !== "string" || slug.trim() === "") {
			return NextResponse.json(
				{
					message: "Invalid or missing slug parameter",
				},
				{ status: 400 }
			);
		}

		const sanitizedSlug = slug.trim().toLowerCase();

		const event: IEvent | null = await Event.findOne({ slug: sanitizedSlug });

		if (!event) {
			return NextResponse.json(
				{ message: `Event with slug '${sanitizedSlug}' not found` },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Event fetched successfully", event },
			{ status: 200 }
		);
	} catch (e) {
		if (process.env.NODE_ENV === "development") {
			console.error("Error fetching event by slug: ", e);
		}

		if (e instanceof Error) {
			return NextResponse.json(
				{ message: "Failed to fetch event data", error: e.message },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
