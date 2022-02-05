// Setup Variables
var treasureImages = ["Coin-1.png", "Coin-2.png", "Coin-3.png", "Coin-4.png", "Coin-5.png", "Coin-6.png", "Coin-7.png", "Coin-8.png", "Coin-9.gif"];
var obstacleImages = ["Gargoyle.png", "Fountain.gif", "Barrel.png"];
var heroImages = ["Hero1.gif", "Hero2.gif", "Hero3.gif"];
var board = [[" "," "," "," "," "," "," "," "," "," "],
             [" "," "," "," "," "," "," "," "," "," "],
             [" "," "," "," "," "," "," "," "," "," "],
             [" "," "," "," "," "," "," "," "," "," "],
             [" "," "," "," "," "," "," "," "," "," "],
             [" "," "," "," "," "," "," "," "," "," "],
             [" "," "," "," "," "," "," "," "," "," "],
             [" "," "," "," "," "," "," "," "," "," "],
             [" "," "," "," "," "," "," "," "," "," "],
             [" "," "," "," "," "," "," "," "," "," "]];

var heroPlaced = false;
var heroImage = 0;
var heroPosition = [0, 0];
var heroScore = 0;
var numTreasures = 0;
var robotPositions = [];
var round = 0;
var gameOver = false;
var robotScore = 0;

// Find table and button html elements
var table = document.getElementById('t1');
var button = document.getElementById("gameButton");

// Helper functions to display and clear messages
function showMessage(message) {
   m1 = document.getElementById("m1");
   m1.innerHTML = message;
   m1.style.display = "block";
}

function clearMessage() {
   m1 = document.getElementById("m1");
   m1.style.display = "none";
}

function updateStatus() {
	var status = document.getElementById("gameStatus");
	statusText = "<h2>Status Information:</h2><br><br>";
	statusText += "Round: " + round + "<br><br>";
	statusText += "Number of Treasures left: " + numTreasures + "<br><br>";
	statusText += "Hero's Score: " + heroScore + "<br><br>";
	statusText += "Killer Skeletons' Score: " + robotScore + "<br><br>";
	status.innerHTML = statusText;
}

// setup stage --------------------------------------------------------------------------------------------------------------------------------------
// Checks if the board space is occupied
function checkForKey(x, y, e) {
	  e = e || window.event;
   	showMessage("Place down a hero (h), killer skeletons (k), obstacles (o), or treasure (1-9).");
   	if (board[y][x] == 0) {
      	var input = String.fromCharCode(e.keyCode);
      	if (validateInput(input)) {
  	        var td = document.getElementById(x+","+y);
            var img = document.createElement('img')
            if (input == "O") {
                img.src = "img/JSGame/" + pickObstacleImage();
                img.class = "object-img";
            } else if (input == "H") {
                img.src = "img/JSGame/" + heroImages[heroImage];
                img.id = "hero";
                img.class = "object-img";
            } else if (input == "K") {
                img.src = "img/JSGame/Skeleton-Idle.gif";
                img.id = "killer" + robotPositions.length;
                img.class = "object-img";
        	} else {
                img.src = "img/JSGame/" + treasureImages[parseInt(input)-1];
                img.id = "coin";
                img.class = "object-img";
            }
            td.appendChild(img);
	        
	        board[y][x] = input;
	        if (input == "H") {
	        	  heroPosition = [x, y];
	        } else if (input == "K") {
	        	  robotPositions.push(new Array(2));
	        	  robotPositions[robotPositions.length-1][0] = x;
	        	  robotPositions[robotPositions.length-1][1] = y;
	        }
	        updateStatus();
      	} 
   	} else {
      	  showMessage("Error: This space is already occupied.");
   	}
}

function pickObstacleImage() {
  var index = Math.floor(Math.random() * (obstacleImages.length));
  return obstacleImages[index];
}

// Validates the user's input to the board
function validateInput(input) {
   	switch (input) {
      	case "H":
         	if (heroPlaced == false) {
            	heroPlaced = true;
              	heroImage = Math.floor(Math.random() * (heroImages.length));
            	return true;
         	} else {
            	showMessage("Error: There can only be 1 hero");
            	return false;
         	}
      	case "1":
      	case "2":
      	case "3":
      	case "4":
      	case "5":
     	case "6":
      	case "7":
      	case "8":
      	case "9":
         	numTreasures++;
      	case "O":
      	case "K":
      		return true;
      default:
         showMessage("Error: Input has to be a value 1-9, o, k or h");
         return false;
   } 
}

// Initialise game board and button for the setup stage
function startSetup() {
   	for (y=0; y<board.length; y++) {
      	var tr = document.createElement("tr");
      	tr.class = "gameTr";
      	table.appendChild(tr);
      	for (x=0; x<board[y].length; x++) {
         	var td  = document.createElement("td");
         	var txt = document.createTextNode(board[y][x]);
         	tr.appendChild(td);
         	td.class = "gameTd";
         	td.setAttribute("id", x+","+y);
         	td.setAttribute("tabindex", "0");
         	td.addEventListener("keydown", checkForKey.bind(null, x, y), false);
         	var txt = document.createTextNode(board[y][x]);
         	td.appendChild(txt);
      	}
   	}
   	showMessage("Place down a hero (h), killer skeletons (k), obstacles (o), or treasure (1-9).");
   	button.setAttribute("value", "End  Setup");
   	button.setAttribute("onClick", "endSetup()");
   	updateStatus();
}

function endSetup() {
   	// Check the hero has been placed
   	if (heroPlaced == false) {
      	showMessage("Error: There must be a hero on the board.");
      	return;
   	}
   	// Change button to end the play stage and prevent board editing:
   	button.setAttribute("value", "End  Game");
   	button.setAttribute("onClick", "endGame(0)");
   	for (y=0; y<board.length; y++) {
      	for (x=0; x<board[y].length; x++) {
         	var td = document.getElementById(x+","+y);
         	td.removeAttribute("tabindex");
         	td.removeEventListener("keydown", checkForKey.bind(null, x, y), false);
      	}
   	}

   	// If there are no treasures, end the game
   	if (numTreasures == 0) {
      	endGame(1);
      	return;
   	}
   	// If all entities are stuck, end the game
   	if (checkAllEntitiesStuck()) {
   		endGame(4);
      	return;
   	}

   	showMessage("Use wasd to move the hero when it is your turn.");
   	// Check for if all entities are stuck
   	if(checkAllEntitiesStuck() == false) {
   		if (checkPlayerStuck()) {
   			endGame(5);
   		} else {
   			document.addEventListener("keydown", this.playerTurn);
   		}
   	} else {
   		endGame(4);
   	}
}
// Play stage ---------------------------------------------------------------------------------------------------------------------------------------
function playerTurn(e) {
   	showMessage("Use wasd to move the hero when it is your turn.");
   	e = e || window.event;
   	var input = String.fromCharCode(e.keyCode);
   	switch (input) {
      	case "W":
         	moveEntity(heroPosition, "hero", "up");
         	break;
      	case "A":
         	moveEntity(heroPosition, "hero", "left");
         	break;
      	case "S":
         	moveEntity(heroPosition, "hero", "down");
         	break;
      	case "D":
         	moveEntity(heroPosition, "hero", "right");
         	break;
      	default:
         	showMessage("Error: the hero is moved with keys w, a, s and d.")
         	return;
   	}
   	updateStatus();
}

function moveEntity(position, entity, direction) {
   	// Find the position the entity wants to move to
   	var targetPosition = [0, 0];
   	targetPosition[0] = position[0];
  	targetPosition[1] = position[1];
   	switch (direction) {
      	case "up":
         	targetPosition[1] = targetPosition[1] - 1;
        	break;
      	case "down":
         	targetPosition[1] = targetPosition[1] + 1;
         	break;
      	case "left":
         	targetPosition[0] = targetPosition[0] - 1;
         	break;
      	case "right":
         	targetPosition[0] = targetPosition[0] + 1;
         	break;
        case "upright":
        	targetPosition[1] = targetPosition[1] - 1;
         	targetPosition[0] = targetPosition[0] + 1;
         	break;
        case "upleft":
        	targetPosition[1] = targetPosition[1] - 1;
         	targetPosition[0] = targetPosition[0] - 1;
         	break;
        case "downleft":
        	targetPosition[1] = targetPosition[1] + 1;
         	targetPosition[0] = targetPosition[0] - 1;
         	break;
        case "downright":
        	targetPosition[1] = targetPosition[1] + 1;
         	targetPosition[0] = targetPosition[0] + 1;
         	break;
   	}
   
   	// check if the targetPosition is off the board or is on an obstacle
   	if (targetPosition[0] < 0 || targetPosition[1] < 0) {
   		if (entity == "hero") {
      		showMessage("Error: The hero is already at the edge of the board.");
      	}
      	return;
   	} else if (targetPosition[1] > board.length - 1) {
   		if (entity == "hero") {
      		showMessage("Error: The hero is already at the edge of the board.");
      	}
      	return;
   	} else if (targetPosition[0] > board[targetPosition[1]].length - 1) {
   		if (entity == "hero") {
      		showMessage("Error: The hero is already at the edge of the board.");
      	}
      	return;
   	} 
   	// get the entity of the target position
   	var targetEntity = board[targetPosition[1]][targetPosition[0]];

   	if (targetEntity == "O") {
      	showMessage("Error: There is an obstacle in the hero's way.");
      	return;
   	}

  	switch (targetEntity) {
  		case "H":
  			if (entity != "hero") {
  				// Hero dies, game ends
            	var td = document.getElementById(position[0]+","+position[1]);
            	td.removeChild(document.getElementById("killer" + entity));
            	td = document.getElementById(targetPosition[0]+","+targetPosition[1]);
            	td.removeChild(document.getElementById("hero"));
        		var img = document.createElement('img')
                img.src = "img/JSGame/Skeleton-Attack.gif";
                img.id = "killer" + entity;
                img.class = "object-img";
                td.appendChild(img);
            	endGame(2);
            	round++;
            	return;
  			}
     	case "K":
     		if (entity == "hero") {
            	// Hero dies, game ends
            	var td = document.getElementById(position[0]+","+position[1]);
              	td.removeChild(document.getElementById("hero"));
              	var td = document.getElementById(targetPosition[0]+","+targetPosition[1]);
              	var index = getIndexOfRobotPositions(targetPosition[0], targetPosition[1]);
              	td.removeChild(document.getElementById("killer" + index));
              	var img = document.createElement('img')
                img.src = "img/JSGame/Skeleton-Attack.gif";
                img.id = "killer" + entity;
                img.class = "object-img";
                td.appendChild(img);
            	endGame(2);
            	round++;
            	return;
            }
     	case "1":
     	case "2":
     	case "3":
     	case "4":
     	case "5":
     	case "6":
     	case "7":
     	case "8":
     	case "9":
        	// add treasure to score
        	if (entity == "hero") {
        		heroScore += parseInt(targetEntity);
        	} else if (!isNaN(entity)) {
        		robotScore += parseInt(targetEntity);
        	}
        	numTreasures--;
        	// Remove treasure from the board
        	board[targetPosition[1]][targetPosition[0]] = " ";
        	var td = document.getElementById(targetPosition[0]+","+targetPosition[1]);
            td.innerHTML = '';
    	case " ":
            // Move entity
            board[position[1]][position[0]] = " ";
            if (entity == "hero") {
            	board[targetPosition[1]][targetPosition[0]] = "H";
            } else {
            	board[targetPosition[1]][targetPosition[0]] = "K";
            }
            var td = document.getElementById(position[0]+","+position[1]);
            
            if (entity == "hero") {
              td.removeChild(document.getElementById("hero"));
            } else {
              td.removeChild(document.getElementById("killer" + entity));
            }
            td = document.getElementById(targetPosition[0]+","+targetPosition[1]);
            if (entity == "hero") {
            	var img = document.createElement('img')
              	img.src = "img/JSGame/" + heroImages[heroImage];
              	img.id = "hero";
              	img.class = "object-img";
            	heroPosition[0] = targetPosition[0];
            	heroPosition[1] = targetPosition[1];
            	round++;
            } else {
            	var img = document.createElement('img')
                img.src = "img/JSGame/Skeleton-Idle.gif";
                img.id = "killer" + entity;
                img.class = "object-img";
            	var robotID = parseInt(entity);
            	robotPositions[robotID][0] = targetPosition[0];
            	robotPositions[robotID][1] = targetPosition[1];
            }
            td.appendChild(img);
            
            
	}
   	// Check treasures for endgame
   	if (numTreasures == 0) {
      	endGame(3);
      	return;
   	}
   	if (entity == "hero") {
   		computerTurn();
   	}
}

function getIndexOfRobotPositions(x, y) {
	for (i = 0; i < robotPositions.length; i++) {
		if (robotPositions[i][0] == x && robotPositions[i][1] == y) {
			return i;
		}
	}
	return -1;
}

function computerTurn() {
   	document.removeEventListener("keydown", this.playerTurn);
   	// Computer moves the killer robots
   	for (i = 0; i < robotPositions.length; i++) {
		if (gameOver == false) {
			var position = robotPositions[i];
			// Check through all adjacent and diagonal spaces looking for valuble targets
			// Hero is the highest priority, then treasures
			// Save direction of valuble position, and empty spaces in case no valuble position is found
			var valubleDirecton = "";
			var valubleEntity = "";
			var emptySpaces = [];
			for (y = position[1]-1; y <= position[1]+1; y++) {
				// Check that the y is within the board boundary
				if (y >= 0 && y < 10) {
					for (x = position[0]-1; x <= position[0]+1; x++) {
						// check that the x is within the board boundary
						if (x >= 0 && x < 10) {
							switch (board[y][x]) {
								case "H":
									// Get direction of movement
									valubleDirecton = getDirection(position, [x, y]);
									valubleEntity = "H";
									break;
								case " ":
									// Add direction to emptySpaces
									emptySpaces.push(getDirection(position, [x, y]));
									break;
								case "1":
								case "2":
								case "3":
								case "4":
								case "5":
								case "6":
								case "7":
								case "8":
								case "9":
									// Compare with current valubleEntity
									if (valubleEntity != "H") {
										if (valubleEntity != "") {
											if (parseInt(board[y][x]) > parseInt(valubleEntity)) {
												// replace valuble entity
												valubleEntity = board[y][x].toString();
												valubleDirecton = getDirection(position, [x, y]);
											}
										} else {
											valubleEntity = board[y][x].toString();
											valubleDirecton = getDirection(position, [x, y]);
										}
									}
									break;
							}
						}
					}
				}
			}
			// Check that valubleEntity has been set
			if (valubleEntity != "") {
				moveEntity(position, i.toString(), valubleDirecton);
			} else if (emptySpaces.length > 0) {
				// Otherwise, move in closest direction to hero if possible
				var closestDirection = getHeroDirection(emptySpaces, position);
				moveEntity(position, i.toString(), closestDirection);
			}
	   		updateStatus();
	   	}
   	}
   	// Check for if all entities are stuck
   	if(checkAllEntitiesStuck() == false && gameOver == false) {
   		// Check if player is stuck
   		if (checkPlayerStuck()) {
   			computerTurn();
   		} else {
   			document.addEventListener("keydown", this.playerTurn);
   		}
   	} else {
   		if (numTreasures == 0) {
   			endGame(3);
   		} else {
   			endGame(2);
   		}
   		
   	}
}

// Returns the string direction from a position to a target position
function getDirection(position, targetPosition) {
	var direction = "";
	if (targetPosition[1] < position[1]) {
		direction += "up";
	} else if (targetPosition[1] > position[1]) {
		direction += "down";
	}
	if (targetPosition[0] < position[0]) {
		direction += "left";
	} else if (targetPosition[0] > position[0]) {
		direction += "right";
	}
	return direction;
}

// Returns the best direction to go in order to get to the hero
function getHeroDirection(availableDirections, position) {
	var bestDirection = getDirection(position, heroPosition);
	// Check if that direction is available to visit
	if (availableDirections.includes(bestDirection)) {
		return bestDirection;
	} else {
		// Otherwise check for direction in priority order
		var priorityOrder = [];
		switch (bestDirection) {
			case "up":
				priorityOrder = ["upleft", "upright", "right", "left", "downleft", "downright", "down"];
				break;
			case "down":
				priorityOrder = ["downleft", "downright", "right", "left", "upleft", "upright", "up"];
				break;
			case "left":
				priorityOrder = ["upleft", "downleft", "down", "up", "upright", "downright", "right"];
				break;
			case "right":
				priorityOrder = ["upright", "downright", "down", "up", "upleft", "downleft", "left"];
				break;
			case "upleft":
				priorityOrder = ["left", "up", "upright", "downleft", "down", "right", "downright"];
				break;
			case "upright":
				priorityOrder = ["right", "up", "upleft", "downright", "down", "left", "downleft"];
				break;
			case "downleft":
				priorityOrder = ["left", "down", "downright", "upleft", "up", "right", "upright"];
				break;
			case "downright":
				priorityOrder = ["right", "down", "downleft", "upright", "down", "left", "upleft"];
				break;
		}
		// Loop through and find which one best matches an available direction
		for (k = 0; k < priorityOrder.length; k++) {
			for (j=0; j < availableDirections.length; j++) {
				if (priorityOrder[k] == availableDirections[j]) {
					return priorityOrder[k];
				}
			}
		}
	}
}

function checkPlayerStuck() {
	// Check if hero is stuck
	for (y = heroPosition[1]-1; y < heroPosition[1]+1; y++) {
		// Check that the y is within the board boundary
		if (y >= 0 && y <= 10) {
			for (x = heroPosition[0]-1; x < heroPosition[0]+1; x++) {
				// check that the x is within the board boundary
				if (x >= 0 && x <= 10) {
					switch (board[y][x]) {
						case " ":
						case "1":
						case "1":
						case "1":
						case "1":
						case "1":
						case "1":
						case "1":
						case "1":
						case "1":
						case "K":
							return false;
					}
				}
			}
		}
	}
	return true;
}

function checkAllEntitiesStuck() {
	// Check if all robots are stuck
	for (i=0; i < robotPositions.length; i++) {
		for (y = robotPositions[i][1]-1; y < robotPositions[i][1]+1; y++) {
			// Check that the y is within the board boundary
			if (y >= 0 && y <= 10) {
				for (x = robotPositions[i][0]-1; x < robotPositions[i][0]+1; x++) {
					// check that the x is within the board boundary
					if (x >= 0 && x <= 10) {
						switch (board[y][x]) {
							case " ":
							case "1":
							case "1":
							case "1":
							case "1":
							case "1":
							case "1":
							case "1":
							case "1":
							case "1":
							case "H":
								return false;
						}
					}
				}
			}
		}
	}
	// Check if hero is stuck
	if (checkPlayerStuck()) {
		return true;	
	} else {
		return false;
	}
}

// end stage ----------------------------------------------------------------------------------------------------------------------------------------
function endGame(condition) {
	gameOver = true;
	updateStatus();
   	document.removeEventListener("keydown", this.playerTurn);
   	switch (condition) {
      	case 0:
         	showMessage("Draw: Game over button pressed.");
         	break;
      	case 1:
         	showMessage("Draw: There were no treasures on the board.");
         	break;
      	case 2:
         	showMessage("Lose: The hero has been killed.");
         	break;
      	case 3:
         	// calculate whether the game was won or lost
         	if (heroScore > robotScore) {
            	showMessage("Win: The hero collected the most treasure.");
         	} else if (heroScore < robotScore) {
            	showMessage("Lose: The killer skeletons collected the most treasure.");
         	} else if (heroScore == robotScore) {
            	showMessage("Draw: Hero collected the same amount of treasure as the killer robots.");
         	}
         	break;
        case 4:
         	showMessage("Draw: No entities are able to move");
         	break;
        case 5:
        	showMessage("Draw: The hero is unable to move.");
        	break;
   	}
   	button.setAttribute("value", "Restart  Game");
   	button.setAttribute("onClick", "window.location.reload()");
}


// Start the setup stage
window.onload = startSetup();