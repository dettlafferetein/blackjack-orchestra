interface Suit {
	entity: JSX.Element,
	class: string
}

export function Card({ value, suit }: { value?: string, suit?: string}) {
	const suits: {[id: string]: Suit} = {
		DIAMONDS: {
			entity: <>&diams;</>,
			class: "text-red-900"
		},
		HEARTS: {
			entity: <>&hearts;</>,
			class: "text-red-900"
		},
		SPADES: {
			entity: <>&spades;</>,
			class: "text-black"
		},
		CLUBS: {
			entity: <>&clubs;</>,
			class: "text-black"
		},
		NONE: {
			entity: <></>,
			class: "line-pattern border-4 border-white"
		},
	};

	suit = suit ?? "NONE";

	return (
	<div className={"relative w-24 h-auto bg-white rounded-md py-10 inline-block box-border mx-4 " + suits[suit].class}>
		<div className="text-3xl absolute top-0 left-0 mt-1 ml-2 leading-none">{suits[suit].entity}</div>
		<div className="text-6xl leading-none text-center">{value ?? <>&nbsp;</>}</div>
		<div className="text-3xl absolute transform rotate-180 bottom-0 right-0 mb-1 mr-2 leading-none">{suits[suit].entity}</div>
	</div>
	);
}

export function CardRow({ children }: { children?: JSX.Element | JSX.Element[]}) {
	return (
	<div className="w-full text-center">
		{children}
	</div>
	);
}
