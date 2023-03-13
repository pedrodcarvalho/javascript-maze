const root = document.getElementById('root');
const wall = document.createElement('img');
wall.src = '/public/images/wall.png';
wall.width = 25;
wall.height = 25;
const path = document.createElement('img');
path.src = '/public/images/path.png';
path.width = 25;
path.height = 25;
const bluePath = document.createElement('img');
bluePath.src = '/public/images/blue-path.png';
bluePath.width = 25;
bluePath.height = 25;
const redPath = document.createElement('img');
redPath.src = '/public/images/red-path.png';
redPath.width = 25;
redPath.height = 25;

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

    tail() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length == 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }
}

class Maze {
    constructor(mazeRows, mazeCols) {
        this.maze = [];
        this.mazeRows = mazeRows;
        this.mazeCols = mazeCols;
    }

    initializeMaze() { };
    addBorders() { };
    addDefaultWalls() { };
    removeWalls() { };
    printMaze() { };
    getNeighbors() { };
    getWallToRemove() { };
    solveMaze() { };
}

let mazeRows = prompt('Enter the number of rows in the maze: ');
if (mazeRows % 2 === 0) {
    mazeRows++;
}
let mazeCols = prompt('Enter the number of columns in the maze: ');
if (mazeCols % 2 === 0) {
    mazeCols++;
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

Maze.prototype.removeWalls = function () {
    let stack = new Stack();
    let startCell = [1, 1];
    stack.push(startCell);
    this.maze[startCell[0]][startCell[1]] = 2;
    let endCell = [this.mazeRows - 2, this.mazeCols - 2];
    let visitedCells = 1;
    let totalCells = (this.mazeRows - 1) * (this.mazeCols - 1) / 4;

    while (visitedCells < totalCells) {
        let currentCell = stack.tail();
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

Maze.prototype.solveMaze = function () {
    let stack = new Stack();
    let startCell = [1, 1];
    stack.push(startCell);
    this.maze[startCell[0]][startCell[1]] = 2;
    let endCell = [this.mazeRows - 2, this.mazeCols - 2];

    const interval = setInterval(() => {
        root.innerHTML = '';
        this.printMaze();
        let currentCell = stack.tail();
        let neighbors = this.getNeighbors(currentCell);
        neighbors = this.checkWalls(currentCell, neighbors);
        console.log(neighbors)
        if (neighbors.length > 0) {
            let randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            this.maze[randomNeighbor[0]][randomNeighbor[1]] = 2;
            stack.push(randomNeighbor);
        }
        else {
            this.maze[currentCell[0]][currentCell[1]] = 3;
            stack.pop();
        }

        if (stack.tail().toString() === endCell.toString()) {
            clearInterval(interval);
        }
    }, 1);
}

const driver = new Maze(mazeRows, mazeCols);
driver.initializeMaze();
driver.addBorders();
driver.addDefaultWalls();
driver.removeWalls();
driver.solveMaze();
driver.printMaze();
