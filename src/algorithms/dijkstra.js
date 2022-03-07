import PriorityQueue from "js-priority-queue";

function djikstra(cellStates, startAndEnd, callback) {
    const weights = [];
    for (let i = 0; i < Object.keys(cellStates).length; i++) {
        weights.push([]);
        for (let j = 0; j < Object.keys(cellStates[i]).length; j++) {
            if (cellStates[i][j].isWall) {
                weights[i][j] = Infinity;
            }
            else {
                weights[i][j] = 1;
            }
        }
    }
    const { start, end } = startAndEnd;
    const moves = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const distances = {};
    const queue = new PriorityQueue({
        comparator: (a, b) => {
            return distances[a.row][a.col] - distances[b.row][b.col];
        }
    });
    for (let i = 0; i < weights.length; i++) {
        distances[i] = {};
        for (let j = 0; j < weights[i].length; j++) {
            distances[i][j] = Infinity;
        }
    }
    distances[start.row][start.col] = 0;

    queue.queue({ row: start.row, col: start.col });

    while (queue.length > 0) {
        let node = queue.dequeue()
        if (node.row === end.row && node.col === end.col) {
            return;
        }

        for (let i = 0; i < moves.length; i++) {
            let move = moves[i];
            let x = node.row + move[0];
            let y = node.col + move[1];
            if (x < 0 || y < 0 || x >= weights.length || y >= weights[x].length) continue;
            if (weights[x][y] === Infinity) continue;

            let alt = distances[node.row][node.col] + weights[x][y];
            if (alt < distances[x][y]) {
                distances[x][y] = alt;
                queue.queue({ row: x, col: y });
                ((val) => {
                    callback(val);
                })({ row: x, col: y });
            }
        }
    }
}

export default djikstra;