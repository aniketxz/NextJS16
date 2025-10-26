"use server";
import { Booking } from "@/src/database";
import connectDB from "@/src/lib/mongodb";

export const createBooking = async ({
	eventId,
	slug,
	email,
}: {
	eventId: string;
	slug: string;
	email: string;
}) => {
	try {
		await connectDB();

		await Booking.create({ eventId, slug, email });

		return { success: true };
	} catch (error) {
		console.log("Create Booking Failed ", error);
		return { success: false };
	}
};
