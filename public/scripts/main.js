import Maze from './Maze.js';

let mazeRows = Number(prompt('Enter number of rows in the maze: '));
let mazeCols = Number(prompt('Enter number of columns in the maze: '));

const driver = new Maze(mazeRows, mazeCols);

driver.initializeMaze();
driver.addBorders();
driver.addDefaultWalls();
driver.removeWalls();
driver.printMaze();
driver.solveMaze();
