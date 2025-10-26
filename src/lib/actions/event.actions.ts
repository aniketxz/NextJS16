"use server";

import connectDB from "@/src/lib/mongodb";
import { Event } from "@/src/database";

export const getSimilarEventsBySlug = async (slug: string) => {
	try {
		await connectDB();

		const event = await Event.findOne({ slug });
		// find similar events
		const similarEvents = await Event.find({
			_id: { $ne: event._id },
			tags: { $in: event.tags },
    }).lean();
    
    return similarEvents.slice(0, 3);
	} catch (error) {
		console.log(error);
		return [];
	}
};
