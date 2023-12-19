/*
Name: Andy Nguyen
Date: 12/18/2023
Contact: Andy_Nguyen4@student.uml.edu
Description: Implemented one line of the Scrabble board game along with seven tiles on a tile rack. Features include: drag-and-drop, 
bonus squares, dealing new tiles, scoring, and restarting. Use developer console (in inspect element) to see which tile is 
dropped into which Scrabble square.
*/

/*global document, console, $*/
/* eslint no-console: "off" */
/* eslint-env es6 */

// data for letter distribution and values
const letterData = {
    "A": { "count": 9, "value": 1 },
    "B": { "count": 2, "value": 3 },
    "C": { "count": 2, "value": 3 },
    "D": { "count": 4, "value": 2 },
    "E": { "count": 12, "value": 1 },
    "F": { "count": 2, "value": 4 },
    "G": { "count": 3, "value": 2 },
    "H": { "count": 2, "value": 4 },
    "I": { "count": 9, "value": 1 },
    "J": { "count": 1, "value": 8 },
    "K": { "count": 1, "value": 5 },
    "L": { "count": 4, "value": 1 },
    "M": { "count": 2, "value": 3 },
    "N": { "count": 6, "value": 1 },
    "O": { "count": 8, "value": 1 },
    "P": { "count": 2, "value": 3 },
    "Q": { "count": 1, "value": 10 },
    "R": { "count": 6, "value": 1 },
    "S": { "count": 4, "value": 1 },
    "T": { "count": 6, "value": 1 },
    "U": { "count": 4, "value": 1 },
    "V": { "count": 2, "value": 4 },
    "W": { "count": 2, "value": 4 },
    "X": { "count": 1, "value": 8 },
    "Y": { "count": 2, "value": 4 },
    "Z": { "count": 1, "value": 10 },
    "Blank": { "count": 2, "value": 0 }
};

let letterTiles = []; // store the current tiles on rack
let score = 0; // global variable to store the score
let tilesPlaced = false;  // variable to track whether any tile is placed on the board

// function to deal tiles to the rack
function dealTiles() {
    
    const availableTiles = Object.keys(letterData);
    letterTiles = [];
    
    // deal 7 random tiles
    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * availableTiles.length);
        const tile = availableTiles.splice(randomIndex, 1)[0];
        letterTiles.push(tile);
    }
    
    updateTileRack();
}

// function to update the tile rack with the letter tiles
function updateTileRack() {
    
    // empty tile rack
    const rackElement = $("#rack");
    rackElement.empty();
    
    // add in the tiles
    letterTiles.forEach(tile => {
        const tileImage = `Scrabble_Tiles/Scrabble_Tile_${tile}.jpg`;
        rackElement.append(`<img src="${tileImage}" alt="${tile}" class="draggable-tile">`)
    });
    
    // this will make the tiles draggable
    $(".draggable-tile").draggable({
        revert: "invalid",
        cursor: "move",
    });
}

// function to calculate and display score
function calculateScore() {
        
    $(".drop-target").each(function (){
            
        const droppedTile = $(this).find("img").attr("alt");
        
        // check if a tile is dropped on the scoreboard
        if (droppedTile) {
            const tileValue = letterData[droppedTile] ? letterData[droppedTile].value : 0;
        
            // check for bonus squares
            if ($(this).hasClass("bonus")) {
                score += tileValue * 2; // double the tile value for bonus square
            } else {
                score += tileValue;
            }
        }
    });
    
    // display the score on the page
    $("#player-score").text(score);
    
    // reset the board and tile rack for a new round
    resetBoardAndRack();
    
    // reset the flag for the new round
    tilesPlaced = false;
}

function resetBoardAndRack() {
    
    // clear the board
    $(".drop-target").empty();
    
    // clear the tile rack
    $("#rack").empty();
    
    // deal new tiles for the next round
    dealTiles();
}

function restartGame() {
    
    // reset the score to 0
    score = 0;
    $("#player-score").text(score);
    
    // reset the board and tile rack
    resetBoardAndRack();
}


$(document).ready(function() {
    
    // droppable function
   $(".drop-target").droppable({
        accept: ".draggable-tile",
        drop: function (event, ui) {
            
            // check if the drop target is empty
            if ($(this).is(':empty')) {
                
                // get the dropped tile element
                const droppedTile = ui.draggable;
            
                // add class to the dropped tile for styling on the board
                droppedTile.addClass("tile-on-board");
            
                // append the dropped tile to the droppable cell
                $(this).empty().append(droppedTile);
            
                // position the dropped tile within the cell
                droppedTile.css({
                    top: -32,
                    left: -3
                });
                
                // log the dropped tile and target square to the console. Can be viewed on developer console (in inspect element)
                const tileLetter = droppedTile.attr("alt");
                const targetSquare = $(this).index();
                
                console.log(`Tile '${tileLetter}' dropped onto square ${targetSquare}`);
                
                // clears the message asking you to place a tile on the Scrabble board
                displayMessage("");
                
            } else {
                // If the drop target is not empty, move the tile back to the tile rack
                ui.helper.remove();
                
                updateTileRack();
            }
            
            // set the flag to true when a tile is placed on the board
            tilesPlaced = true;
        }
    });
    
    // function to display a message on the page
    function displayMessage(message) {
        $("#message").text(message);
    }

    // allows you to move tiles from the Scrabble board back to the tile rack
    $("#rack").droppable({
        accept: ".draggable-tile",
        drop: function (event, ui) {
            
            // remove tile from the board
            ui.helper.remove();
            
            updateTileRack();
            
        }
    });
    
    // deal initial tiles
    dealTiles();
    
    // deal button click event (let's you deal new tiles)
    $("#deal-button").on("click", function(){
        dealTiles();
    });
    
    // calculate score button click event (gets you the score)
    $("#calculate-score").on("click", function(){
        
        // check if at least one tile is placed on the board
        if (tilesPlaced) {
            calculateScore();
        } else {
            displayMessage("Place at least one tile on the Scrabble board to get the score and proceed to the next round.");
        }
    });
    
    // restart game button click event
    $("#restart-game").on("click", function(){
        restartGame();
    });
    
});