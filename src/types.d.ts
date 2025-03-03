type Champion = {
  name: string;
  cost: number;
  traits: string[];
  icon: string;
  squareIcon: string;
};

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