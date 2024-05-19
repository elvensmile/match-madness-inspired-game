import { openDB, IDBPDatabase } from "idb";
import { japanese_set } from "~/db/initialData";

const DB_NAME = "wordsToLearnDB";
const DB_VERSION = 1;
const STORE_NAME_SETS = "sets";
const STORE_NAME_WORDS = "words";

export interface Word {
  id?: number;
  setId: number;
  word: string;
  translation: string;
}

export interface WordSet {
  id?: number;
  name: string;
}

let dbPromise: Promise<IDBPDatabase<any>>;

export const initDB = (): Promise<IDBPDatabase<any>> => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME_SETS)) {
          db.createObjectStore(STORE_NAME_SETS, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains(STORE_NAME_WORDS)) {
          const wordsStore = db.createObjectStore(STORE_NAME_WORDS, {
            keyPath: "id",
            autoIncrement: true,
          });
          wordsStore.createIndex("setId", "setId", { unique: false });
        }
      },
    });
  }
  return dbPromise;
};

export const addSet = async (wordSet: WordSet): Promise<void> => {
  const db = await initDB();
  await db.add(STORE_NAME_SETS, wordSet);
};

export const updateSet = async (wordSet: WordSet): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME_SETS, wordSet);
};

export const getSetInfo = async (id: number): Promise<WordSet> => {
  const db = await initDB();
  return await db.get(STORE_NAME_SETS, id);
};

export const deleteSet = async (id: number): Promise<void> => {
  const db = await initDB();
  await db.delete(STORE_NAME_SETS, id);
};

export const getWordsBySetId = async (setId: number): Promise<Word[]> => {
  const db = await initDB();
  return await db.getAllFromIndex(STORE_NAME_WORDS, "setId", setId);
};

export const addWord = async (word: Word): Promise<void> => {
  const db = await initDB();
  await db.add(STORE_NAME_WORDS, word);
};

export const updateWord = async (word: Word): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME_WORDS, word);
};

export const deleteWord = async (id: number): Promise<void> => {
  const db = await initDB();
  await db.delete(STORE_NAME_WORDS, id);
};

export const getAllSets = async (): Promise<WordSet[]> => {
  const db = await initDB();
  const sets = await db.getAll(STORE_NAME_SETS);
  if (sets.length === 0) {
    await addSet({ id: 1, name: "Example Data (Japanese)" });
    Object.keys(japanese_set).forEach((el, idx) => {
      addWord({ id: idx, setId: 1, word: el, translation: japanese_set[el] });
    });
    window.location.reload();
  }
  return sets;
};
