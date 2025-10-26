import Image from "next/image";
import Link from "next/link";

interface Props {
	title: string;
	image: string;
	slug: string;
	location: string;
	date: string;
	time: string;
}

const EventCard = ({ title, image, slug, location, date, time }: Props) => {
	return (
		<Link href={`/events/${slug}`} id="event-card">
			<Image
				src={image}
				alt={title}
				width={410}
				height={300}
				className="poster"
			/>

			<div className="flex flex-row gap-2">
				<Image src="/icons/pin.svg" alt="location" className="size-3.5" width={0} height={0} />
				<p>{location}</p>
			</div>

			<p className="title">{title}</p>

			<div className="datetime">
				<div>
					<Image src="/icons/calendar.svg" alt="date" className="size-3.5" width={0} height={0} />
					<p>{date}</p>
				</div>
				<div>
					<Image src="/icons/clock.svg" alt="time" className="size-3.5" width={0} height={0} />
					<p>{time}</p>
				</div>
			</div>
		</Link>
	);
};

export default EventCard;
