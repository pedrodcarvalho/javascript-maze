const root = document.getElementById('root');

const WIDTH = 25;
const HEIGHT = 25;

const wall = createCell(WIDTH, HEIGHT, '#e7e7e7');
const path = createCell(WIDTH, HEIGHT, '#181818');
const bluePath = createCell(WIDTH, HEIGHT, '#2596be');
const redPath = createCell(WIDTH, HEIGHT, '#be4d25');

function createCell(WIDTH, HEIGHT, bgColor) {
    const cell = document.createElement('div');

    cell.style.width = `${WIDTH}px`;
    cell.style.height = `${HEIGHT}px`;
    cell.style.backgroundColor = bgColor;

    return cell;
}

let mazeRows = Number(prompt('Enter the number of rows in the maze: '));
mazeRows = mazeRows % 2 === 1 ? mazeRows + 2 : mazeRows + 3;

let mazeCols = Number(prompt('Enter the number of columns in the maze: '));
mazeCols = mazeCols % 2 === 1 ? mazeCols + 2 : mazeCols + 3;

class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        return this.items.push(element);
    }

    pop() {
        if (this.items.length > 0) {
            return this.items.pop();
        }
    }

    top() {
        return this.items[this.items.length - 1];
    }
}

class Maze {
    constructor(mazeRows, mazeCols) {
        this.maze = [];
        this.mazeRows = mazeRows;
        this.mazeCols = mazeCols;
        this.currentMaze = [];
    }

    initializeMaze() { };
    addBorders() { };
    addDefaultWalls() { };
    removeWalls() { };
    getNeighbors() { };
    getWallToRemove() { };
    printMaze() { };
    updateMaze() { };
    solveMaze() { };
    checkWalls() { };
}

Maze.prototype.initializeMaze = function () {
    for (let i = 0; i < this.mazeRows; i++) {
        this.maze[i] = [];

        for (let j = 0; j < this.mazeCols; j++) {
            this.maze[i][j] = 0;
        }
    }
}

Maze.prototype.addBorders = function () {
    for (let i = 0; i < this.mazeRows; i++) {
        this.maze[i][0] = 1;
        this.maze[i][this.mazeCols - 1] = 1;
    }

    for (let j = 0; j < this.mazeCols; j++) {
        this.maze[0][j] = 1;
        this.maze[this.mazeRows - 1][j] = 1;
    }
}

Maze.prototype.addDefaultWalls = function () {
    for (let i = 0; i < this.mazeRows; i++) {
        for (let j = 0; j < this.mazeCols; j++) {
            if (i % 2 === 0 && j % 2 === 0 || i % 2 === 1 && j % 2 === 0 || i % 2 === 0 && j % 2 === 1) {
                this.maze[i][j] = 1;
            }
        }
    }
}

Maze.prototype.removeWalls = function () {
    let stack = new Stack();

    stack.push([1, 1]);
    this.maze[1][1] = 2;

    let visitedCells = 1;
    let totalCells = (this.mazeRows - 1) * (this.mazeCols - 1) / 4;

    while (visitedCells < totalCells) {
        let currentCell = stack.top();
        let neighbors = this.getNeighbors(currentCell);

        if (neighbors.length > 0) {
            let randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

            let wallToRemove = this.getWallToRemove(currentCell, randomNeighbor);

            this.maze[wallToRemove[0]][wallToRemove[1]] = 2;
            this.maze[randomNeighbor[0]][randomNeighbor[1]] = 2;
            stack.push(randomNeighbor);

            visitedCells++;
        }
        else {
            stack.pop();
        }
    }

    for (let i = 0; i < this.mazeRows; i++) {
        for (let j = 0; j < this.mazeCols; j++) {
            if (this.maze[i][j] === 2) {
                this.maze[i][j] = 0;
            }
        }
    }

    this.currentMaze = this.maze.map(function (arr) {
        return [...arr];
    });
}

Maze.prototype.getNeighbors = function (currentCell) {
    let neighbors = [];
    let row = currentCell[0];
    let col = currentCell[1];

    if (row - 2 > 0 && this.maze[row - 2][col] === 0) {
        neighbors.push([row - 2, col]);
    }
    if (row + 2 < this.mazeRows - 1 && this.maze[row + 2][col] === 0) {
        neighbors.push([row + 2, col]);
    }
    if (col - 2 > 0 && this.maze[row][col - 2] === 0) {
        neighbors.push([row, col - 2]);
    }
    if (col + 2 < this.mazeCols - 1 && this.maze[row][col + 2] === 0) {
        neighbors.push([row, col + 2]);
    }

    return neighbors;
}

Maze.prototype.getWallToRemove = function (currentCell, randomNeighbor) {
    let wallToRemove = [];
    let row = currentCell[0];
    let col = currentCell[1];

    if (row - 2 === randomNeighbor[0]) {
        wallToRemove = [row - 1, col];
    }
    else if (row + 2 === randomNeighbor[0]) {
        wallToRemove = [row + 1, col];
    }
    else if (col - 2 === randomNeighbor[1]) {
        wallToRemove = [row, col - 1];
    }
    else if (col + 2 === randomNeighbor[1]) {
        wallToRemove = [row, col + 1];
    }

    return wallToRemove;
}

Maze.prototype.printMaze = function () {
    for (let i = 0; i < this.mazeRows; i++) {
        root.appendChild(document.createElement('div'));

        for (let j = 0; j < this.mazeCols; j++) {
            if (this.maze[i][j] === 0) {
                root.childNodes[i].appendChild(path.cloneNode());
            }
            else if (this.maze[i][j] === 1) {
                root.childNodes[i].appendChild(wall.cloneNode());
            }
            else if (this.maze[i][j] === 2) {
                root.childNodes[i].appendChild(bluePath.cloneNode());
            }
            else if (this.maze[i][j] === 3) {
                root.childNodes[i].appendChild(redPath.cloneNode());
            }
        }
    }
}

Maze.prototype.updateMaze = function () {
    let diff = [];

    for (let i = 0; i < this.mazeRows; i++) {
        for (let j = 0; j < this.mazeCols; j++) {
            if (this.maze[i][j] !== this.currentMaze[i][j]) {
                diff.push([{ x: i, y: j, value: this.maze[i][j] }]);
            }
        }
    }

    for (let i = 0; i < diff.length; i++) {
        let x = diff[i][0].x;
        let y = diff[i][0].y;
        let value = diff[i][0].value;

        if (value === 0) {
            root.childNodes[x].childNodes[y].replaceWith(path.cloneNode());
        }
        else if (value === 1) {
            root.childNodes[x].childNodes[y].replaceWith(wall.cloneNode());
        }
        else if (value === 2) {
            root.childNodes[x].childNodes[y].replaceWith(bluePath.cloneNode());
        }
        else if (value === 3) {
            root.childNodes[x].childNodes[y].replaceWith(redPath.cloneNode());
        }
    }

    this.currentMaze = this.maze.map(function (arr) {
        return [...arr];
    });
}

Maze.prototype.solveMaze = function () {
    let stack = new Stack();

    stack.push([1, 1]);
    this.maze[1][1] = 2;

    let endCell = [this.mazeRows - 2, this.mazeCols - 2];

    const update = setInterval(() => {
        let currentCell = stack.top();
        let neighbors = this.getNeighbors(currentCell);

        neighbors = this.checkWalls(currentCell, neighbors);

        if (neighbors.length > 0) {
            let randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

            this.maze[currentCell[0] === randomNeighbor[0] ? currentCell[0] : (currentCell[0] + randomNeighbor[0]) / 2][currentCell[1] === randomNeighbor[1] ? currentCell[1] : (currentCell[1] + randomNeighbor[1]) / 2] = 2;
            this.maze[randomNeighbor[0]][randomNeighbor[1]] = 2;
            stack.push(randomNeighbor);
        }
        else {
            this.maze[currentCell[0]][currentCell[1]] = 3;
            stack.pop();
            this.maze[currentCell[0] === stack.top()[0] ? currentCell[0] : (currentCell[0] + stack.top()[0]) / 2][currentCell[1] === stack.top()[1] ? currentCell[1] : (currentCell[1] + stack.top()[1]) / 2] = 3;
        }

        if (stack.top().toString() === endCell.toString()) {
            clearInterval(update);
        }

        this.updateMaze();
    }, 1);
}

Maze.prototype.checkWalls = function (currentCell, neighbors) {
    let row = currentCell[0];
    let col = currentCell[1];
    let newNeighbors = [];

    for (let i = 0; i < neighbors.length; i++) {
        if (row - 2 === neighbors[i][0] && this.maze[row - 1][col] === 0) {
            newNeighbors.push(neighbors[i]);
        }
        else if (row + 2 === neighbors[i][0] && this.maze[row + 1][col] === 0) {
            newNeighbors.push(neighbors[i]);
        }
        else if (col - 2 === neighbors[i][1] && this.maze[row][col - 1] === 0) {
            newNeighbors.push(neighbors[i]);
        }
        else if (col + 2 === neighbors[i][1] && this.maze[row][col + 1] === 0) {
            newNeighbors.push(neighbors[i]);
        }
    }

    return newNeighbors;
}

const driver = new Maze(mazeRows, mazeCols);

driver.initializeMaze();
driver.addBorders();
driver.addDefaultWalls();
driver.removeWalls();
driver.printMaze();
driver.solveMaze();
