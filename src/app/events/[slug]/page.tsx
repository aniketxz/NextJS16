import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { IEvent } from "@/src/database";
import BookEvent from "@/src/components/BookEvent";
import { getSimilarEventsBySlug } from "@/src/lib/actions/event.actions";
import EventCard from "@/src/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
	icon,
	alt,
	label,
}: {
	icon: string;
	alt: string;
	label: string;
}) => (
	<div className="flex-row-gap-2 items-center">
		<Image src={icon} alt={alt} width={17} height={17} className="h-auto w-auto" />
		<p>{label}</p>
	</div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
	<div className="agenda">
		<h2>Agenda</h2>
		<ul>
			{agendaItems.map((item) => (
				<li key={item}>{item}</li>
			))}
		</ul>
	</div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
	<div className="flex flex-row gap-1.5 flex-wrap">
		{tags.map((tag) => (
			<div className="pill" key={tag}>
				{tag}
			</div>
		))}
	</div>
);

const EventDetailsPage = async ({
	params,
}: {
	params: Promise<{ slug: string }>;
}) => {
	"use cache";
	cacheLife("hours");
	const { slug } = await params;

	let event: IEvent;
	try {
		const req = await fetch(`${BASE_URL}/api/events/${slug}`, {
			next: { revalidate: 60 },
		});

		if (!req.ok) {
			if (req.status === 404) return notFound();
			throw new Error(`Failed to fetch event: ${req.statusText}`);
		}

		const res = await req.json();
		event = res.event;

		if (!event) {
			return notFound();
		}
	} catch (error) {
		console.error("Error fetching event:", error);
		return notFound();
	}

	const {
		description,
		image,
		overview,
		date,
		time,
		location,
		mode,
		agenda,
		audience,
		organizer,
		tags,
	} = event;

	const bookings = 10;

	const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

	return (
		<section id="event">
			<div className="header">
				<h1>Event Description</h1>
				<p>{description}</p>
			</div>

			<div className="details">
				<div className="content">
					<Image
						src={image}
						alt="Event Banner"
						width={800}
						height={800}
						className="banner"
					/>

					<section className="flex-col-gap-2">
						<h2>Overview</h2>
						<p>{overview}</p>
					</section>

					<section className="flex-col-gap-2">
						<h2>Event Details</h2>
						<EventDetailItem
							icon="/icons/calendar.svg"
							alt="calendar"
							label={date}
						/>
						<EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
						<EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
						<EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
						<EventDetailItem
							icon="/icons/audience.svg"
							alt="audience"
							label={audience}
						/>
					</section>

					<EventAgenda agendaItems={agenda} />

					<section className="flex-col-gap-2">
						<h2>About the Organizer</h2>
						<p>{organizer}</p>
					</section>

					<EventTags tags={tags} />
				</div>

				<aside className="booking">
					<div className="signup-card">
						<h2>Book Your Spot</h2>
						{bookings > 0 ? (
							<p className="text-sm">
								Join {bookings} people who have already booked their spot
							</p>
						) : (
							<p className="text-sm">Be the first to book your spot!</p>
						)}
						<BookEvent eventId={event._id as string} slug={event.slug} />
					</div>
				</aside>
			</div>

			<div className="flex w-full flex-col gap-4 pt-20">
				<h2>Similar Events</h2>
				<div className="events">
					{similarEvents.length > 0 &&
						similarEvents.map((similarEvent: IEvent) => (
							<EventCard key={similarEvent.slug} {...similarEvent} />
						))}
				</div>
			</div>
		</section>
	);
};

export default EventDetailsPage;
