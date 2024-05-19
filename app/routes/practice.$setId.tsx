import React, {useEffect, useState} from "react";
import GameBoard from "~/components/gameboard";
import {getSetInfo, getWordsBySetId, Word} from "~/db/utils";
import {LoaderFunction} from "@remix-run/router";
import {useLoaderData} from "@remix-run/react";
import {useParams} from "react-router";

interface LoaderData {
    words: Word[];
}

export const loader: LoaderFunction = async ({ params }) => {
    return { words: [] };
};

const PracticeSetPage: React.FC = () => {
    const initialData = useLoaderData<LoaderData>();
    const { setId } = useParams();
    const [words, setWords] = useState<Word[]>(initialData.words);
    const [name, setName] = useState<string>('');

    useEffect(() => {
        const fetchWords = async () => {
            const words = await getWordsBySetId(Number(setId));
            setWords(words);
            const info = await getSetInfo(Number(setId))
            setName(info.name)
        };

        fetchWords();
    }, [setId]);
    console.log(words)
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Practice Set {name}</h1>
            {words.length < 1 ? 'Loading ...' : <GameBoard words={words} />}
        </div>
    );
};

export default PracticeSetPage;
