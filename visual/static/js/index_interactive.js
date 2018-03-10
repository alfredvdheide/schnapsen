// TODO

// Implement one-hot encoding in ml.py

// Add some arg options to server.py, so the parameters are not hard coded.

// Look into making parameters I am carrying around global

// Edge case of two possible marriages at the same time, however seems somewhat unlikely

// Maybe give possible moves in the state json object from the backend

// Maybe gray out submit button when no valid move is chosen

// Add scores on top

// Add delays


// Removes all cards that are not needed to play Schnapsen
function schnapsenDeck(){
    fullDeck = Deck();
    fullDeck.cards.forEach(function (card) {
        if(card.rank<10 && card.rank>1){
            card.unmount();
        }
    });
    return syncCardIndices(fullDeck)
}

// I feel disgusted with myself
function syncCardIndices(visualDeck){
    card_indices = [];

    card_indices.push(visualDeck.cards[26])
    card_indices.push(visualDeck.cards[35])
    card_indices.push(visualDeck.cards[38])
    card_indices.push(visualDeck.cards[37])
    card_indices.push(visualDeck.cards[36])

    card_indices.push(visualDeck.cards[39])
    card_indices.push(visualDeck.cards[48])
    card_indices.push(visualDeck.cards[51])
    card_indices.push(visualDeck.cards[50])
    card_indices.push(visualDeck.cards[49])

    card_indices.push(visualDeck.cards[13])
    card_indices.push(visualDeck.cards[22])
    card_indices.push(visualDeck.cards[25])
    card_indices.push(visualDeck.cards[24])
    card_indices.push(visualDeck.cards[23])

    card_indices.push(visualDeck.cards[0])
    card_indices.push(visualDeck.cards[9])
    card_indices.push(visualDeck.cards[12])
    card_indices.push(visualDeck.cards[11])
    card_indices.push(visualDeck.cards[10])

    visualDeck.backEndIndices = card_indices

    return visualDeck
}

function moveCard(card, xc, yc, rotc=0){
    card.animateTo({
        delay: 100,
        duration: 500,
        ease: 'quartOut',
        
        x: xc, //Math.random() * window.innerWidth - window.innerWidth / 2,
        y: yc, //Math.random() * window.innerHeight - window.innerHeight / 2
        rot: rotc
    });
}

function dealStock(visualDeck, stock){

    stock.forEach(function(cardIndex, stockIndex){
        card = visualDeck.backEndIndices[cardIndex];

        if(stockIndex==0){
            card.setSide('front');
            moveCard(card, -3*width/8, -cardWidth/2, 0);
        } else {
            card.setSide('back');
            moveCard(card, -3*width/8, 0);
        }
    });
}

function arrIsNull(arr){
    for(i=0; i<arr.length; i++){
        if (arr[i] != null){
            return false;
        }
    }
    return true;
}

function arrElemFreq(arr, elem){
    ct = 0;
    for(i=0; i<arr.length; i++){
        if(arr[i] == elem){
            ct++;
        }
    }
    return ct;
}

function orderCards(visualDeck, stock, trump_suit){
    new_cards_array = [];
    var trump_jack_index;

    visualDeck.cards.forEach(function(card){
        card.setSide("front");
    });

    if(trump_suit == "C"){
        trump_jack_index = 4;
    } else if(trump_suit == "D"){
        trump_jack_index = 9;
    } else if(trump_suit == "H"){
        trump_jack_index = 14;
    } else if(trump_suit == "S"){
        trump_jack_index = 19;
    }

    new_cards_array.push(visualDeck.backEndIndices[trump_jack_index]);

    stock.forEach(function(stockIndex){
        if(new_cards_array.map(x => x.i).indexOf(visualDeck.backEndIndices[stockIndex].i) < 0){
            new_cards_array.push(visualDeck.backEndIndices[stockIndex]);
        }
    })

    visualDeck.cards.forEach(function(card, index){
        if(new_cards_array.map(x => x.i).indexOf(card.i) < 0){
            new_cards_array.push(card);
        }
    });

    if(new_cards_array.length == visualDeck.cards.length){
        visualDeck.cards = new_cards_array;
    } else {
        var arr = [];
        new_cards_array.forEach(function(card){
            if (typeof(arr[card.i]) == 'undefined'){
                arr[card.i] = 1;
            } else arr[card.i]++;
        });
        console.log(arr);

        alert("Card ordering error" + new_cards_array.length + " " + visualDeck.cards.length);}

    visualDeck.cards.forEach(function (card, index) {
        card.pos = index;
        card.$el.style.zIndex = card.pos;
    });

}

function arrangeCards(visualDeck, backEndState){
    p1placed = 0;
    p2placed = 0;
    p1wonCount=0;
    p2wonCount=0;

    var x = null;
    var y = null;

    card_states = getCardStateArray(backEndState);
    perspective = getCardStateArray(backEndState, true);

    p1wonTotal = arrElemFreq(card_states, "P1W");
    p2wonTotal = arrElemFreq(card_states, "P2W");



    card_states.forEach(function(card_state, card_index){

        if (perspective[card_index] == "U"){
            visualDeck.backEndIndices[card_index].setSide('back');
        } else {
            visualDeck.backEndIndices[card_index].setSide('front');
        }

        if(card_state == "P1H"){
            

            x = (-2 + p1placed) * cardWidth;
            // x = width/3 + (p1placed/4)*(width/3) - width/2;
            y = height/4;

            p1placed++;

        } else if(card_state == "P2H"){

            x = (-2 + p2placed) * cardWidth;
            // x = width/3 + (p2placed/4)*(width/3) - width/2;
            y = -height/4;

            p2placed++;

        } else if(card_state == "P1D"){

            x = cardWidth
            y = 0;

            p1placed++;

        } else if(card_state == "P2D"){

            x = -cardWidth
            y = 0;

            p2placed++;

        } else if(card_state == "P1W"){

            x = width/2 - cardWidth * (1/2 + p1wonCount)
            y = height/2 - cardHeight/4

            p1wonCount++;

        } else if(card_state == "P2W"){

            x = width/2 - cardWidth * (1/2 + p2wonCount)
            y = -height/2 - cardHeight/4

            p2wonCount++;
        }

        if(x!=null && y != null){
            moveCard(visualDeck.backEndIndices[card_index], x, y);
            x = null;
            y = null;

        }


    });
}

function setUpCards(visualDeck, backEndState){

    height = window.innerHeight;
    width = window.innerWidth;

    font_size = window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0,-2);

    cardWidth = font_size*4
    cardHeight= cardWidth*1.41

    //STOCK
    if(!ordered){
        orderCards(visualDeck, backEndState.deck.stock, backEndState.deck.trump_suit);
        ordered = true;
    }

    dealStock(visualDeck, backEndState.deck.stock);
    arrangeCards(visualDeck, backEndState)
}

function getCardStateArray(backEndState, perspective=false){
    
    card_state = perspective ? backEndState.deck.p1_perspective : backEndState.deck.card_state;

    trick = backEndState.deck.trick;

    for(i=0; i<2; i++){
        if(trick[i] != null){
            card_state[trick[i]] = "P" + parseInt(i+1) + "D";
        }
    }
    return card_state;
}

function stateFinished(state){
    if(state.revoked != null || state.p1_points >= 66 || state.p2_points >= 66){
        return true;
    }
    return false;
}

function getMarriage(moves){

    marr = null;

    moves.forEach(function(m){

        //Reverse order so we can take advantage of lazy evaluation
        if(m[1] !== null && m[0] !== null){
            marr = m;
        }
    });

    return marr;
}

function getTrumpExchange(moves){

    trump_exchange = null;

    moves.forEach(function(legalMove){
        if(legalMove[0] === null){
            trump_exchange = legalMove;
        }
    });

    return trump_exchange;
}

function putTrickAway(deck, state){

    prev = state.deck.previous_trick;

    deck.backEndIndices[prev[0]].setSide('front');
    moveCard(deck.backEndIndices[prev[0]], cardWidth, 0);

    deck.backEndIndices[prev[1]].setSide('front');
    moveCard(deck.backEndIndices[prev[1]], -cardWidth, 0);

}

function startGameLoop(deck, state){

    setUpCards(deck, state);

    setTimeout(function(){

        if(stateFinished(state)){
            console.log("Game finished");
            return;
        }

        // Not using async request because it doesn't run on main thread
        $.ajax({
            url: '/next',
            type: 'GET',
            success: function(response) {
                newState = JSON.parse(response);

                if(arrIsNull(newState.deck.trick) && !arrIsNull(newState.deck.previous_trick)){
                    putTrickAway(deck, newState);
                    setTimeout(function(){
                        console.log("Player 1: " + newState.p1_points);
                        console.log("Player 2: " + newState.p2_points);
                        startGameLoop(deck, newState);
                    }, INTERVAL);
                } else {
                    startGameLoop(deck, newState);
                }


            },
            error: function(error) {
                console.log(error);
                console.log("Error in game loop");
                return;
            }
        });

    }, INTERVAL);

}

function disableClickable(){
    $("button").prop("disabled", true);
    $(".card").unbind("click");
    $(".card").css( 'cursor', 'default' );


}

function enableClickable(deck, state){
    $("button").prop("disabled", false);

    card_state = getCardStateArray(state);

    $.ajax({
        url: '/getlegalmoves',
        type: 'GET',
        success: function(response) {
            moves = JSON.parse(response);
            marriage = getMarriage(moves);
            exchange = getTrumpExchange(moves)

            if(marriage === null){
                $("#marriage").prop("disabled", true);
            }

            if(exchange === null){
                $("#exchange").prop("disabled", true);
            }

            moves.forEach(function(legalMove){
                if(legalMove[0] !== null && legalMove[1] === null){
                    $(deck.backEndIndices[legalMove[0]].$el).css( 'cursor', 'pointer' );

                    $(deck.backEndIndices[legalMove[0]].$el).click(function(){

                        moveCard(deck.backEndIndices[legalMove[0]], cardWidth, 0);
                        move = [legalMove[0], null];

                        $(".card").unbind("click");
                        $(".card").css( 'cursor', 'default' );
                    });

                }
            });

        },
        error: function(error) {
            console.log(error);
        }
    });
}

function submitMove(){
    if(move === null || move.length != 2){
        alert("INVALID move submitted" + move);
        return;
    }

    $.ajax({
    url: '/sendmove',
    type: 'POST',
    data: JSON.stringify(move),
    dataType: "json", 
    //since we mentioned dataType json, we don't have to parse the response
    success: function(response) {
            gameLoop(deck, response);            
        },
        error: function(error) {
            console.log(error);
        }
    });    


}


// This function manages player turns
function gameLoop(deck, state){

    baseState = state;

    setUpCards(deck, state);

    if (state.player1s_turn == true){
        move = marriage = exchange = null;
        enableClickable(deck, state);
    } else {
        disableClickable();
        $.ajax({
            url: '/next',
            type: 'GET',
            success: function(response) {
                stateObject = JSON.parse(response);
                gameLoop(deck, stateObject);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

}

var height, width, font_size, cardHeight, cardWidth;

var ordered = false;
var stateObject = null;

const INTERVAL = 3000;

// Get container
var $container = document.getElementById('container');

// Create Deck
var deck = schnapsenDeck();

// Add container to DOM
deck.mount($container);

// var prefix = Deck.prefix;

// var transform = prefix('transform');

// var translate = Deck.translate;

// var $topbar = $('topbar');

var baseState;
var move=null;
var marriage=null;
var exchange=null;

$("#reset").click(function(){
    setUpCards(deck, baseState);
    enableClickable(deck, baseState);
    move = null;
});

$("#submit").click(function(){
    submitMove();
});

$("#marriage").click(function(){
    // setUpCards(deck, baseState);
    if (marriage !== null){
        if(move !== null){
            if(move[0] == marriage[0]){

                moveCard(deck.backEndIndices[marriage[1]], 2*cardWidth, 0);
                move = marriage;

            } else if (move[0] == marriage[1]){

                moveCard(deck.backEndIndices[marriage[0]], 2*cardWidth, 0);
                move = [marriage[1], marriage[0]];

            } else {
                $("#reset").click();
                $(deck.backEndIndices[marriage[0]].$el).click();
                moveCard(deck.backEndIndices[marriage[1]], 2*cardWidth, 0);
                move = marriage;
            }
        } else {
            $(deck.backEndIndices[marriage[0]].$el).click();
            moveCard(deck.backEndIndices[marriage[1]], 2*cardWidth, 0);
            move = marriage;
        }
    }
});

$("#exchange").click(function(){
    if (exchange !== null){
        if(move !== null){
            $("#reset").click();
        } 

        move = exchange;
        submitMove();
    }
});

$.ajax({
    url: '/generate',
    type: 'GET',
    success: function(response) {
        stateObject = JSON.parse(response);
        console.log(stateObject);
        // setUpCards(deck, stateObject);
        // enableClickable(deck, stateObject);
        // startGameLoop(deck, stateObject);
        gameLoop(deck, stateObject);
        
    },
    error: function(error) {
        console.log(error);
    }
});
