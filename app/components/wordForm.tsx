import React, { useState, useEffect } from "react";

import { getWordsBySetId, addWord, updateWord, deleteWord } from "../db/utils";
import { useParams } from "react-router";

interface Word {
  id?: number;
  setId: number;
  word: string;
  translation: string;
}

const WordSetForm: React.FC = () => {
  const { setId } = useParams();
  const [words, setWords] = useState<Word[]>([]);
  const [newWord, setNewWord] = useState<string>("");
  const [newTranslation, setNewTranslation] = useState<string>("");
  const [editWordId, setEditWordId] = useState<number | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      if (setId) {
        const fetchedWords = await getWordsBySetId(Number(setId));
        setWords(fetchedWords);
      }
    };
    fetchWords();
  }, [setId]);

  const handleAddOrUpdateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setId) return;

    const word: Word = {
      setId: Number(setId),
      word: newWord,
      translation: newTranslation,
    };

    if (editWordId) {
      word.id = editWordId;
      await updateWord(word);
      setEditWordId(null);
    } else {
      await addWord(word);
    }

    setNewWord("");
    setNewTranslation("");
    const updatedWords = await getWordsBySetId(Number(setId));
    setWords(updatedWords);
  };

  const handleEditWord = (word: Word) => {
    setEditWordId(word.id || null);
    setNewWord(word.word);
    setNewTranslation(word.translation);
  };

  const handleDeleteWord = async (id: number) => {
    await deleteWord(id);
    const updatedWords = await getWordsBySetId(Number(setId));
    setWords(updatedWords);
  };

  const handleCancelEditWord = () => {
    setEditWordId(null);
    setNewWord("");
    setNewTranslation("");
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-800">
        Manage Words in Set
      </h2>
      <form onSubmit={handleAddOrUpdateWord} className="mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            name="word"
            placeholder="Word"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="translation"
            placeholder="Translation"
            value={newTranslation}
            onChange={(e) => setNewTranslation(e.target.value)}
            className="w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="p-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-200"
          >
            {editWordId ? "Update Word" : "Add Word"}
          </button>
          {editWordId && (
            <button
              type="button"
              onClick={handleCancelEditWord}
              className="p-2 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-4">
        {words.map((word) => (
          <li
            key={word.id}
            className="flex justify-between items-center p-3 border-b border-gray-200"
          >
            <div className="text-gray-800 font-medium">
              {word.word} - {word.translation}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditWord(word)}
                className="p-2 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteWord(word.id!)}
                className="p-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordSetForm;
