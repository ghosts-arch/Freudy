const playerEmote: string = "♟️";
const emptyCaseEmote: string = "⬜";

export class BoardService {
	buildBoard = (playerPosition: number): string[] => {
		const board: string[] = [];
		let n: number | undefined;
		for (let x = 0; x <= 10; x++) {
			for (let y = 0; y <= 10; y++) {
				if (x === 0 || x === 10 || y === 0 || y === 10) {
					if (x === 10) {
						n = 10 - y;
					} else if (y === 0) {
						n = 20 - x;
					} else if (x === 0) {
						n = 20 + y;
					} else {
						n = 30 + x;
					}
					if (n === playerPosition) {
						board.push(playerEmote);
					} else if (n === 0) {
						board.push("🟦");
					} else {
						board.push(emptyCaseEmote);
					}
				} else {
					board.push("⬛");
				}
			}
			board.push("\n");
		}
		return board;
	};
}
