import { useQuery } from "react-query";

type Trait = {
  name: string;
  desc: string;
  icon: string;
  effects: {
    minUnits: number;
    maxUnits: number;
    style: number;
  }[];
};

type SingleSetData = {
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
    return await response.json();
}

export const useData = () => {
  const { data, isLoading,error,refetch} = useQuery("cdragon", fetchJson);
  
  if (!data) return { data, isLoading,error,refetch};
  
  
  
}