"""
RandomBot -- A simple strategy: enumerates all legal moves, and picks one
uniformly at random.
"""

# Import the API objects
from api import State, Deck, util
import csv
import random

class Bot:
    def __init__(self):
        pass

    def get_move(self, state):
        # type: (State) -> tuple[int, int]
        """
        Function that gets called every turn. This is where to implement the strategies.
        Be sure to make a legal move. Illegal moves, like giving an index of a card you
        don't own or proposing an illegal mariage, will lose you the game.
       	TODO: add some more explanation
        :param State state: An object representing the gamestate. This includes a link to
            the states of all the cards, the trick and the points.
        :return: A tuple of integers or a tuple of an integer and None,
            indicating a move; the first indicates the card played in the trick, the second a
            potential spouse.
        """
        #initialize list of cards
        def initializeCSVList():
            if(state.get_stock_size() == 10):
                with open("bots/heuristic/possibleCards.csv", "w") as csv_file:
                    csv_writer = csv.writer(csv_file, delimiter=',')
                    myList = list(range(0,20))
                    csv_writer.writerow(myList)

        #get list of cards
        def getCSVList():
            with open("bots/heuristic/possibleCards.csv", newline='') as csv_file:
                reader = csv.reader(csv_file)
                cardsLeftOver = reader
                cardsLeftOver = list(cardsLeftOver)[0]
                return cardsLeftOver

        #remove one from the list
        def removeFromCSVList(myList, cardIndex):
            try:
                myList.remove(str(cardIndex))
                with open("bots/heuristic/possibleCards.csv", "w") as csv_file:
                    csv_writer = csv.writer(csv_file, delimiter=',')
                    csv_writer.writerow(myList)
            except:
                pass

        def how_many_card_can_beat_it(state,myList,card) -> int:
            # see how many trump cards exist that are better
            cardsThatCanBeatMyCard = 0
            for ints in myList:
                ints = int(ints)
                # print(ints,card[0])
                if (ints % 5 < card[0] % 5) or \
                        (Deck.get_suit(card[0]) != state.get_trump_suit()
                         and Deck.get_suit(ints) == state.get_trump_suit()):
                    cardsThatCanBeatMyCard +=1
            return cardsThatCanBeatMyCard

        # All legal moves
        moves = state.moves()
        cardsLeftOver = getCSVList()

        if (state.get_stock_size() == 10):
            initializeCSVList()

        if state.get_opponents_played_card() is not None:
            removeFromCSVList(cardsLeftOver, state.get_opponents_played_card())
            moves_same_suit = []
            # Get all moves of the same suit as the opponent's played card
            for index, move in enumerate(moves):
                if move[0] is not None and Deck.get_suit(move[0]) == Deck.get_suit(state.get_opponents_played_card()):
                    moves_same_suit.append(move)

            if len(moves_same_suit) > 0:
                myDict = {}
                for move in moves_same_suit:
                    if (move[0] is not None):
                        myDict[move] = how_many_card_can_beat_it(state, cardsLeftOver, move)
                removeFromCSVList(cardsLeftOver, min(myDict, key=myDict.get)[0])
                return min(myDict, key=myDict.get)
            else:
                myDict = {}
                for move in moves:
                    if (move[0] is not None):
                        myDict[move] = how_many_card_can_beat_it(state, cardsLeftOver, move)
                removeFromCSVList(cardsLeftOver, min(myDict, key=myDict.get)[0])
                return min(myDict, key=myDict.get)

        else:
            myDict = {}
            for move in moves:
                if (move[0] is not None):
                    myDict[move] = how_many_card_can_beat_it(state, cardsLeftOver, move)
            removeFromCSVList(cardsLeftOver, min(myDict, key=myDict.get)[0])
            return min(myDict, key=myDict.get)

