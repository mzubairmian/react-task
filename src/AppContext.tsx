// AppContext.tsx
import React, { createContext, useReducer, useContext, useEffect } from "react";
import { Button, Form } from "semantic-ui-react";
import { openDB, DBSchema, IDBPDatabase } from "idb";

export interface Fact {
  id: number;
  title: string;
  upvotes: number;
  date: string;
}
interface AppProviderProps {
  children: React.ReactNode;
}

interface State {
  facts: Fact[];
  editingFact: Fact | null;
  sortBy: "";
}

type Action =
  | { type: "ADD_FACT"; payload: Fact }
  | { type: "UPDATE_FACT"; payload: Fact }
  | { type: "DELETE_FACT"; payload: number }
  | { type: "SET_FACTS"; payload: Fact[] }
  | { type: "FETCH_ALL_FACTS" }
  | { type: "SET_EDITING_FACT"; payload: Fact | null };

interface AppContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const initialState: State = {
  facts: [],
  editingFact: null,
  sortBy: "",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const appReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_FACT":
      addFactToDB(action.payload);
      return { ...state, facts: [...state.facts, action.payload] };
    case "UPDATE_FACT":
      const updatedFacts = state.facts.map((fact) =>
        fact.id === action.payload.id ? action.payload : fact
      );
      updateFactInDB(action.payload);
      return { ...state, facts: updatedFacts };
    case "DELETE_FACT":
      const filteredFacts = state.facts.filter(
        (fact) => fact.id !== action.payload
      );
      deleteFactFromDB(action.payload);
      return { ...state, facts: filteredFacts };
    case "SET_FACTS":
      return { ...state, facts: action.payload };
    case "SET_EDITING_FACT":
      return { ...state, editingFact: action.payload };
    case "FETCH_ALL_FACTS":
      return state;
    default:
      return state;
  }
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  useEffect(() => {
    initializeDB();
  }, []);

  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const factsFromDB = await getAllFactsFromDB();
        dispatch({ type: "SET_FACTS", payload: factsFromDB });
      } catch (error) {
        console.error("Error fetching data from IndexedDB:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// IndexedDB functions

interface FactDB extends DBSchema {
  facts: {
    key: number;
    value: Fact;
    indexes: { "by-id": number };
  };
}

const openDatabase = async (): Promise<IDBPDatabase<FactDB>> => {
  return openDB<FactDB>("fact-database", 1, {
    upgrade(db) {
      db.createObjectStore("facts", { keyPath: "id" });
    },
  });
};

const initializeDB = async (): Promise<void> => {
  await openDatabase();
};

const addFactToDB = async (fact: Fact): Promise<void> => {
  const db = await openDatabase();
  const tx = db.transaction("facts", "readwrite");
  const store = tx.objectStore("facts");
  await store.put(fact);
  await tx.done;
};

const updateFactInDB = async (fact: Fact): Promise<void> => {
  const db = await openDatabase();
  const tx = db.transaction("facts", "readwrite");
  const store = tx.objectStore("facts");
  await store.put(fact);
  await tx.done;
};

const deleteFactFromDB = async (id: number): Promise<void> => {
  const db = await openDatabase();
  const tx = db.transaction("facts", "readwrite");
  const store = tx.objectStore("facts");
  await store.delete(id);
  await tx.done;
};

export const getAllFactsFromDB = async (): Promise<Fact[]> => {
  const db = await openDatabase();
  const tx = db.transaction("facts", "readonly");
  const store = tx.objectStore("facts");
  return store.getAll();
};
