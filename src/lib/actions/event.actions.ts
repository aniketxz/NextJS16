"use server";

import connectDB from "@/src/lib/mongodb";
import { Event, IEvent } from "@/src/database";

export const getSimilarEventsBySlug = async (slug: string) => {
	try {
		await connectDB();

		const event = await Event.findOne({ slug });

		const similarEvents = await Event.find({
			_id: { $ne: event._id },
			tags: { $in: event.tags },
		})
			.limit(3)
			.lean();

		return JSON.parse(JSON.stringify(similarEvents)) as IEvent[];
	} catch (error) {
		console.log(error);
		return [];
	}
};
