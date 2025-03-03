import { useQuery } from "react-query";

export type SingleSetData = {
  champions: Champion[];
  name: string;
  traits: Trait[];
};

type DataJson = {
  items: unknown;
  setData: unknown;
  sets: {
    [setIdx: string]: SingleSetData
  };
};

const fetchJson = async (): Promise<DataJson> => {
    const response = await fetch("https://raw.communitydragon.org/latest/cdragon/tft/en_gb.json");
    return (await response.json()) as DataJson;
}

export const useData = () => {
  const { data, isLoading, error, refetch} = useQuery("cdragon", fetchJson);
  
  if (!data) return { data, isLoading, error, refetch};
  
  const newestSet = data.sets[`${Math.max(...Object.keys(data.sets).map(key => Number(key)))}`];

  return { data: newestSet, isLoading, error, refetch};
}