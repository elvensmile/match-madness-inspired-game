import React, { useState, useEffect, useCallback } from "react";
import Card from "./card";
import { Word } from "~/db/utils";

const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

interface GameEndOverlayProps {
  message: string;
  onPlayAgain: () => void;
}

const GameEndOverlay: React.FC<GameEndOverlayProps> = ({
  message,
  onPlayAgain,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="flex text-center p-8 bg-white rounded-lg shadow-lg flex-col">
      <h2 className="text-3xl font-bold mb-4">{message}</h2>
      <button
        className="mt-4 p-2 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition duration-200"
        onClick={onPlayAgain}
      >
        Play Again
      </button>
      <a href="/" className="hover:text-blue-300 transition-colors px-3 py-2">
        or Practice another set
      </a>
    </div>
  </div>
);

interface GameBoardProps {
  words: Word[];
}

const GameBoard: React.FC<GameBoardProps> = ({ words }) => {
  const [shuffledPairs, setShuffledPairs] = useState<
    { id: string; content: string; type: string }[]
  >([]);
  const [selectedWords, setSelectedWords] = useState<
    { content: string; index: number; id: string }[]
  >([]);
  const [timer, setTimer] = useState<number>(60);
  const [gameState, setGameState] = useState<
    "in-progress" | "game-over-lost" | "game-over-win"
  >("in-progress");
  const [incorrect, setIncorrect] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean>(false);
  /** State to keep track of the indices of matched cards
   * We use a Set because it automatically ensures that indices
   * are unique and provides efficient operations for adding and checking the presence of indices **/
  const [matchedIndices, setMatchedIndices] = useState<Set<number>>(new Set());

  // Effect to shuffle the words and start the timer when the component mounts
  useEffect(() => {
    const pairs = words.flatMap(({ id, word, translation }) => [
      { id, content: word, type: "word" },
      { id, content: translation, type: "translation" },
    ]);

    setShuffledPairs(shuffleArray(pairs));

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setGameState("game-over-lost");
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [words]);

  useEffect(() => {
    if (matchedIndices.size / 2 === words.length) {
      setGameState("game-over-win");
    }
    if (gameState !== "in-progress") {
      setTimer(0);
    }
  }, [gameState, matchedIndices]);

  const checkMatch = useCallback(() => {
    const [first, second] = selectedWords;
    if (first.id === second.id) {
      setMatchedIndices(
        (prevIndices) => new Set([...prevIndices, first.index, second.index]),
      );
      setCorrect(true);
      setTimeout(() => {
        setCorrect(false);
        setSelectedWords([]);
      }, 500);
    } else {
      setIncorrect(true);
      setTimeout(() => {
        setIncorrect(false);
        setSelectedWords([]);
      }, 500);
    }
  }, [selectedWords, shuffledPairs, words.length]);

  useEffect(() => {
    if (selectedWords.length === 2) {
      checkMatch();
    }
  }, [selectedWords, checkMatch]);

  const handleWordClick = (content: string, index: number, id: string) => {
    if (
      gameState === "in-progress" &&
      selectedWords.length < 2 &&
      !selectedWords.some((selected) => selected.index === index)
    ) {
      setSelectedWords((prevSelected) => [
        ...prevSelected,
        { content, index, id },
      ]);
    }
  };

  const getButtonClass = useCallback(
    (index: number): string => {
      const isSelected = selectedWords.some(
        (selected) => selected.index === index,
      );
      const isIncorrect =
        incorrect &&
        selectedWords.length === 2 &&
        (selectedWords[0].index === index || selectedWords[1].index === index);
      const isMatched = matchedIndices.has(index);

      if (isMatched) return "invisible";
      if (isIncorrect) return "bg-red-500 text-white animate-bounce";
      if (isSelected) return `bg-green-500 text-white`;
      return "bg-blue-500 text-white";
    },
    [selectedWords, incorrect, matchedIndices, correct],
  );

  const handlePlayAgain = () => window.location.reload();

  return (
    <div className="flex flex-col items-center w-full shadow-md bg-white p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Matching Madness</h1>
        <div className="w-full max-w-xl mx-auto">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200">
                  Matches
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-pink-600">
                  {matchedIndices.size / 2}/{words.length}
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
              <div
                style={{
                  width: `${(matchedIndices.size / 2 / words.length) * 100}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {shuffledPairs.map((item, index) => (
          <Card
            id={item.id}
            key={`${item.id}_${item.type}`}
            content={item.content}
            onClick={() => handleWordClick(item.content, index, item.id)}
            additionalCn={getButtonClass(index)}
          />
        ))}
      </div>
      <div className="text-center mt-8">
        <h2 className="text-2xl">{`Time Left: ${timer}s`}</h2>
        {gameState !== "in-progress" && (
          <GameEndOverlay
            message={gameState === "game-over-lost" ? "Game Over!" : "You Win!"}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
};

export default GameBoard;
