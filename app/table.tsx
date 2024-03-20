import { useEffect, useState } from 'react';
import { Card, CardRow } from './card';

interface CardObj{
	suit: string,
	value: string
}

interface CardsObj{
	dealer: CardObj[],
	player: CardObj[],
	left: number,
	deck: string
}

interface PointsObj{
	dealer: number,
	player: number,
}

export default function Table() {
	const [gameState, setGameState] = useState<string>('handdone');
	const [cards, setCards] = useState<CardsObj>({
		dealer: [],
		player: [],
		left: 0,
		deck: 'new'
	});
	const [points, setPoints] = useState<PointsObj>({
		dealer: 0,
		player: 0
	});

	const nextRound = () => {
		dealCards(4, true);
	}

	const dealCards = (count: number = 1, reset: boolean = false) => {
		setGameState('dealing');
		
		fetch("https://deckofcardsapi.com/api/deck/"+(reset && (cards.left < 52*6*.3) ? 'new' : cards.deck)+"/draw/?deck_count=6&count="+count)
			.then(res => res.json())
			.then(
				(result) => {
					let newCards: CardsObj = {...cards};
					let nextDealer: boolean = false;

					if (reset) {
						newCards.player = [];
						newCards.dealer = [];
					}

					newCards.left = result.remaining;
					newCards.deck = result.deck_id;

					for (let v of result.cards) {
						newCards[nextDealer ? 'dealer' : 'player'].push({
							suit: v.suit,
							value: isNaN(v.value) ? v.value.slice(0, 1) : v.value
						});

						nextDealer = !nextDealer;
					}

					setCards(newCards);
					setGameState('dealt');
				},
				(error) => {
					console.log('API Error');
					console.log(error);
				}
		);
	}

	const hit = () => {
		dealCards(1);
	}

	const stand = () => {
		setGameState('handdone');
	}

	const calculatePoints = (crds: CardObj[]) => {
		let pts: number = 0;
		let aces: number = 0;
		for (let card of crds) {
			switch (card.value) {
				case 'A':
					pts += 11;
					aces++;
					break;
				case 'K':
				case 'Q':
				case 'J':
					pts += 10;
					break;
				default:
					pts += parseInt(card.value);
			}
		}

		if (pts - (aces * 10) > 21) {
			pts = pts - (aces * 10);
			setGameState('handdone');
		} else if (pts > 21) {
			pts = pts - (Math.ceil((pts - 21) / 10) * 10);
		}

		return pts;
	}

	useEffect(() => {
		const newPoints: PointsObj = {
			dealer: calculatePoints(cards.dealer),
			player: calculatePoints(cards.player)
		};

		setPoints(newPoints);
	}, [cards]);


	return (
		<main className="container mx-auto min-h-screen flex flex-col justify-between">
			<div className="mx-auto mt-5 w-full">
				<div className="text-3xl mb-5 text-center">Dealer ({points.dealer})</div>
				<CardRow>
				{cards.dealer.map((card: CardObj, index: number) => (<Card suit={card.suit} value={card.value} key={index} />))}
				</CardRow>
			</div>
			<div className="mx-auto mt-5 w-auto text-center">
				{gameState === 'handdone' && points.player > 0 ? <div className="text-3xl mb-5">You {(points.player > points.dealer) && (points.player <= 21) ? 'Won' : 'Lost'}</div> : <></>}
				{gameState === 'handdone' ? <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={nextRound}>Next Hand</button> : <></>}
			</div>
			<div className="mx-auto mb-5 w-full">
				<div className="text-3xl mb-5 text-center">You ({points.player})</div>
				<CardRow>
				{cards.player.map((card: CardObj, index: number) => (<Card suit={card.suit} value={card.value} key={index} />))}
				</CardRow>
				<div className="w-full text-center mt-5">
					<button className={"mr-10 bg-blue-500 text-white font-bold py-2 px-4 rounded " + (gameState === 'dealt' ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed")} onClick={hit}>Hit</button>
					<button className={"bg-blue-500 text-white font-bold py-2 px-4 rounded " + (gameState === 'dealt' ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed")} onClick={stand}>Stand</button>
				</div>
			</div>
		</main>
	);
}
