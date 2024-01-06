import { create } from "zustand";
import { getAll, getHealth } from "../controllers/API";
import { APIDataType, APIKindType } from "../types/api";
import { TypesStoreType } from "../types/zustand/types";
import useAlertStore from "./alertStore";
import { templatesGenerator, typesGenerator } from "../utils/reactflowUtils";

export const useTypesStore = create<TypesStoreType>((set, get) => ({
  types: {},
  templates: {},
  data: {},
  getFilterEdge: [],
  getTypes: () => {
    return new Promise<void>(async (resolve, reject) => {
      getAll()
        .then((response) => {
          const data = response.data;
          useAlertStore.setState({ loading: false });
          set((old) => ({
            types: typesGenerator(data),
            data: { ...old.data, ...data },
            templates: templatesGenerator(data),
          }));
          resolve();
        })
        .catch((error) => {
          console.error("An error has occurred while fetching types.");
          console.log(error);
          getHealth().catch((e) => {
            useAlertStore.setState({
              fetchError: true,
              loading: false,
            });
            reject();
          });
        });
    });
  },
  setTypes: (newState: {}) => {
    set({ types: newState });
  },
  setTemplates: (newState: {}) => {
    set({ templates: newState });
  },
  setData: (change: APIDataType | ((old: APIDataType) => APIDataType)) => {
    let newChange = typeof change === "function" ? change(get().data) : change;
    set({ data: newChange });
  },
  setFilterEdge: (newState) => {
    set({ getFilterEdge: newState });
  },
}));
