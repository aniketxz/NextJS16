"use client";

import Image from "next/image";

const ExploreBtn = () => {
	return (
		<button
			type="button"
			id="explore-btn"
			className="mt-7 mx-auto"
			onClick={() => {}}
		>
			<a href="#events">
				Explore Events
				<Image
					src="/icons/arrow-down.svg"
					alt="arrow-down"
					width={0}
					height={0}
					className="size-6"
				></Image>
			</a>
		</button>
	);
};

export default ExploreBtn;
