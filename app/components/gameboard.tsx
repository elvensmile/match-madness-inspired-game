import React, {useState, useEffect} from "react";
import Card from "./card";
import {Word} from "~/db/utils";
import {Link} from "@remix-run/react";

interface GameEndOverlayProps {
    message: string;
    onPlayAgain: () => void;
}

const GameEndOverlay: React.FC<GameEndOverlayProps> = ({ message, onPlayAgain }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="flex text-center p-8 bg-white rounded-lg shadow-lg flex-col">
            <h2 className="text-3xl font-bold mb-4">{message}</h2>
            <button
                className="mt-4 p-2 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition duration-200"
                onClick={onPlayAgain}
            >
                Play Again
            </button>
            <Link to={'/'} className="hover:text-blue-300 transition-colors px-3 py-2">or Practice another set</Link>
        </div>
    </div>
);

interface GameBoardProps {
    words: Word[];
}

const  GameBoard: React.FC<GameBoardProps> = ({ words }) => {
    const [shuffledWords, setShuffledWords] = useState<{ word: string, type: string }[]>([]);
    const [selectedWords, setSelectedWords] = useState<{ word: string, index: number }[]>([]);
    const [matches, setMatches] = useState<number>(0);
    const [timer, setTimer] = useState<number>(60);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [incorrect, setIncorrect] = useState<boolean>(false);
    const [correct, setCorrect] = useState<boolean>(false);
    const [matchedIndices, setMatchedIndices] = useState<number[]>([]);

    useEffect(() => {
        // Shuffle and set the words and translations
        const shuffled = [...words.map(pair => ({
            word: pair.word,
            type: 'word'
        })), ...words.map(pair => ({word: pair.translation, type: 'translation'}))]
            .sort(() => Math.random() - 0.5);
        setShuffledWords(shuffled);

        // Start the timer
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    setGameOver(true);
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        if (selectedWords.length === 2) {
            const wordPair1 = words.find(pair => pair.word === selectedWords[0].word || pair.translation === selectedWords[0].word);
            const wordPair2 = words.find(pair => pair.word === selectedWords[1].word || pair.translation === selectedWords[1].word);

            if (wordPair1 && wordPair2 && wordPair1.id === wordPair2.id) {
                setMatches(matches + 1);
                setCorrect(true);
                setMatchedIndices([...matchedIndices, selectedWords[0].index, selectedWords[1].index]);
                setTimeout(() => {
                    setCorrect(false);
                   // setShuffledWords(prev => prev.filter((_, index) => index !== selectedWords[0].index && index !== selectedWords[1].index));
                    setSelectedWords([]);
                }, 500);
                if (matches + 1 === words.length) {
                    setGameWon(true);
                }
            } else {
                setIncorrect(true);
                setTimeout(() => {
                    setIncorrect(false);
                    setSelectedWords([]);
                }, 500);
            }
        }
    }, [selectedWords]);

    const handleWordClick = (word: string, index: number) => {
        if (!gameOver && selectedWords.length < 2 && !selectedWords.some(selected => selected.index === index)) {
            setSelectedWords([...selectedWords, { word, index }]);
        }
    };

    const getButtonClass = (index: number): string => {
        const isSelected = selectedWords.some(selected => selected.index === index);
        const isIncorrect = incorrect && selectedWords.length === 2 && (selectedWords[0].index === index || selectedWords[1].index === index);
        const isMatched = matchedIndices.includes(index);


        if (isMatched) return 'invisible';
        if (isIncorrect) return 'bg-red-500 text-white animate-bounce';
        if (isSelected) return `bg-green-500 text-white ${correct ? 'animate-ping' : ''}`;
        return 'bg-blue-500 text-white';
    };

    const handlePlayAgain = () => {
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center w-full shadow-md bg-white p-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Matching Madness</h1>
                <div className="w-full max-w-xl mx-auto">
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                <span
                    className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200">
                  Matches
                </span>
                            </div>
                            <div className="text-right">
                <span className="text-xs font-semibold inline-block text-pink-600">
                  {matches}/{words.length}
                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
                            <div
                                style={{width: `${(matches / words.length) * 100}%`}}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {shuffledWords.map((item, index) => (
                    <Card id={String(index)} key={`${index}_${item.word}_${item.type}`} content={item.word} onClick={() => handleWordClick(item.word, index)}
                          additionalCn={getButtonClass(index)}/>
                ))}
            </div>
            <div className="text-center mt-8">
                <h2 className="text-2xl">{`Time Left: ${timer}s`}</h2>
                {(gameOver || gameWon) && (
                    <GameEndOverlay
                        message={gameOver ? "Game Over!" : "You Win!"}
                        onPlayAgain={handlePlayAgain}
                    />
                )}
                {/*{gameOver && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="flex text-center p-8 bg-white rounded-lg shadow-lg flex-col">
                            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
                            <button
                                className="mt-4 p-2 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition duration-200"
                                onClick={() => window.location.reload()}
                            >
                                Play Again
                            </button>
                            <Link to={'/'} className="hover:text-blue-300 transition-colors px-3 py-2">or Practice another set</Link>
                        </div>
                    </div>
                )}*/}
            </div>
        </div>
    );
};

export default GameBoard;
