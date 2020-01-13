"""
RandomBot -- A simple strategy: enumerates all legal moves, and picks one
uniformly at random.
"""

# Import the API objects
from api import State, Deck
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

        # All legal moves
        moves = state.moves()
        chosen_move = moves[0]

        #logic
        #play marriages
        #play trump card
        #play highest rated card

        # if following opponents play and all plays lead to loss play worst card.
        if state.get_opponents_played_card() is not None:
            moves_same_suit = []
            # Get all moves of the same suit as the opponent's played card
            for move in moves:
                if move[0] is not None and Deck.get_suit(move[0]) == Deck.get_suit(state.get_opponents_played_card()):
                    moves_same_suit.append(move)

            for move in moves_same_suit:
                if move[0] > state.get_opponents_played_card():
                    pass
                else:
                    min = moves_same_suit[0]
                    for moves in moves_same_suit:
                        if moves[0] < min[0]:
                            min = moves[0]
                    return min

        # play marriages
        for move in moves:
            if move[0] is not None and move[1] is not None:
                # print("Play Marriage")
                return move

        # play trump card
        for move in moves:
            if move[0] is not None and Deck.get_suit(move[0]) == state.get_trump_suit():
                # print("Play trump card")
                return move

        # play highest rated card
        chosen_move = moves[0]
        for move in moves:
            if move[0] is not None and move[0] % 5 <= chosen_move[0] % 5:
                # print("play highest rated card")
                chosen_move = move
            return chosen_move



        # Return a random choice
        # print("Play random card")
        return random.choice(moves)