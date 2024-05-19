import React, {useEffect, useState} from "react";
import {useLoaderData, Link} from "@remix-run/react";
import {getAllSets, WordSet} from '~/db/utils'
import type {MetaFunction} from "@remix-run/node";
import {LoaderFunction} from "@remix-run/router";


interface LoaderData {
    sets: WordSet[];
}

export const meta: MetaFunction = () => {
    return [
        {title: "Practice Words!"},
        {name: "description", content: "Practice Words with this awesome application!"},
    ];
};

export const loader: LoaderFunction = async () => {
    //TODO database?
    return {sets: []};
};

const IndexPage: React.FC = () => {
    const initialData = useLoaderData<LoaderData>();
    const [sets, setSets] = useState<WordSet[]>(initialData.sets);

    useEffect(() => {
        const fetchSets = async () => {
            const sets = await getAllSets();
            setSets(sets);
        };

        fetchSets();
    }, []);

    return (
        <>      <h1 className="text-2xl font-bold mb-4 text-gray-800">Which set do you want to practice today?</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sets.map((set) => (
                    <Link to={`/practice/${set.id}`} key={set.id}
                          className="transform hover:scale-105 transition-transform duration-300">
                        <div className="p-6 bg-green-500 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="text-lg font-semibold text-white">{set.name}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
        ;
};

export default IndexPage;
