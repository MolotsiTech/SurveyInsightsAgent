import {

    createContext,

    useContext,

    useState

} from "react";

const DatasetContext =
    createContext<any>(null);

export function DatasetProvider({

    children

}: any) {

    const [

        datasetId,

        setDatasetId

    ] = useState("");

    return (

        <DatasetContext.Provider

            value={{

                datasetId,

                setDatasetId

            }}

        >

            {children}

        </DatasetContext.Provider>

    );
}

export function useDataset() {

    return useContext(
        DatasetContext
    );

}