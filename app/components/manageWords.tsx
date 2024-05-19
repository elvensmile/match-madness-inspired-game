import React, { useState, useEffect, FormEvent } from "react";
import { getAllSets, addSet, updateSet, deleteSet, getWordsBySetId, addWord, updateWord, deleteWord } from '../db/utils'
import {Link, Outlet, useNavigate} from "@remix-run/react";

interface WordSet {
    id?: number;
    name: string;
}

const ManageSets: React.FC = () => {
    const [sets, setSets] = useState<WordSet[]>([]);
    const [newSetName, setNewSetName] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSets = async () => {
            const fetchedSets = await getAllSets();
            setSets(fetchedSets);
        };
        fetchSets();
    }, []);

    const handleAddSet = async (e: React.FormEvent) => {
        e.preventDefault();
        const wordSet: WordSet = { name: newSetName };
        await addSet(wordSet);
        setNewSetName("");
        const updatedSets = await getAllSets();
        setSets(updatedSets);
    };

    const handleDeleteSet = async (id: number) => {
        await deleteSet(id);
        const updatedSets = await getAllSets();
        setSets(updatedSets);
        navigate('/manage')
    };

    return (
        <div className="mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Manage Sets</h1>
            <form onSubmit={handleAddSet} className="mb-6">
                <div className="flex space-x-4">
                    <input
                        type="text"
                        name="setName"
                        placeholder="Set Name"
                        value={newSetName}
                        onChange={(e) => setNewSetName(e.target.value)}
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="p-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-200">
                        Add Set
                    </button>
                </div>
            </form>
            <div className="flex space-x-6">
                <div className="w-2/5">
                    <ul className="space-y-3">
                        {sets.map((set) => (
                            <li key={set.id} className="flex justify-between items-center p-3 border-b border-gray-200">
                                <Link to={`/manage/${set.id}`} className="text-blue-500 hover:underline font-medium">
                                    {set.name}
                                </Link>
                                <button
                                    onClick={() => handleDeleteSet(set.id!)}
                                    className="p-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-3/5"><Outlet/></div>
            </div>
        </div>
    );
};

export default ManageSets;
