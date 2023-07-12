import rawData from "./assets/cdragon.json";
import { Square } from "./Square";
import "./App.css";
// import { ColorScale } from "./ColorScale";
import { TotalNumber } from "./TotalNumber";
import { useState } from "react";

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

type Data = {
  items: unknown;
  setData: unknown;
  sets: {
    "9": {
      champions: Champion[];
      name: string;
      traits: Trait[];
    };
  };
};

const ORIGINS = [
  "Yordle",
  "Void",
  "Demacia",
  "Noxus",
  "Shurima",
  "Piltover",
  "Shadow Isles",
  "Freljord",
  "Targon",
  "Zaun",
  "Ionia",
  "Darkin",
  "Wanderer",
];

const data = (rawData as Data).sets["9"];

const championsByTrait = (
  trait: string | Trait,
  subset: Champion[] = data.champions
) => {
  const _trait = typeof trait === "string" ? trait : trait.name;
  const list = subset.filter((c) => c.traits.includes(_trait));
  const uniques = [
    ...new Map<String, Champion>(list.map((c) => [c.name, c])).values(),
  ];
  return {
    champions: uniques,
    byTrait: (nTrait: typeof trait) => championsByTrait(nTrait, uniques),
    byAnyTrait: (...nTraits: (typeof trait)[]) => [
      ...new Map(
        nTraits
          .filter((t) => t !== trait)
          .flatMap((ntr) => championsByTrait(ntr, uniques).champions)
          .map((c) => [c.name, c])
      ).values(),
    ],
  };
};

const alphaCmp = (a: Trait, b: Trait) => a.name.localeCompare(b.name);
const champCmp = (others: Trait[]) => (a: Trait, b: Trait) =>
  championsByTrait(b).byAnyTrait(...others).length -
  championsByTrait(a).byAnyTrait(...others).length;

const originTraits = data.traits.filter((t) =>
  ORIGINS.map((o) => o.toLowerCase()).includes(t.name.toLowerCase())
);
const typeTraits = data.traits.filter(
  (t) => !ORIGINS.map((o) => o.toLowerCase()).includes(t.name.toLowerCase())
);

const champsWith3Traits = data.champions.filter((c) => c.traits.length > 2);
const typeTraits3: Trait[] = [];
const originTraits3: Trait[] = [];
champsWith3Traits.forEach((c) => {
  const _typeTraits = c.traits
    .map((t) => typeTraits.find((ttr) => ttr.name === t))
    .filter((t) => t) as Trait[];
  const _originTraits = c.traits
    .map((t) => originTraits.find((otr) => otr.name === t))
    .filter((t) => t) as Trait[];

  if (_typeTraits.length > 1) typeTraits3.push(..._typeTraits);
  if (_originTraits.length > 1) originTraits3.push(..._originTraits);
});

const typeTraits3Unique = [
  ...new Map<string, Trait>(typeTraits3.map((t) => [t.name, t])).values(),
];
const originTraits3Unique = [
  ...new Map<string, Trait>(originTraits3.map((t) => [t.name, t])).values(),
];

const Table = ({
  horizontalTraits,
  verticalTraits,
  symmetric,
}: {
  horizontalTraits: Trait[];
  verticalTraits: Trait[];
  symmetric: boolean;
}) => {
  const [sortByChamps, setSortByChamps] = useState<boolean>(false);

  if (sortByChamps) {
    horizontalTraits.sort(champCmp(verticalTraits));
    verticalTraits.sort(champCmp(horizontalTraits));
  } else {
    horizontalTraits.sort(alphaCmp);
    verticalTraits.sort(alphaCmp);
  }
  if (symmetric) horizontalTraits = [...horizontalTraits].reverse();

  return (
    <table style={{ margin: "1em" }}>
      <thead>
        <tr>
          <td />
          <td
            colSpan={100}
            onClick={() => setSortByChamps((v) => !v)}
            style={{
              userSelect: "none",
              cursor: "pointer",
              backgroundImage:
                "radial-gradient(rgba(0,0,0,0) 70%, rgba(255, 255, 255, 0.3) 100%",
              borderRadius: "0.5em",
              letterSpacing: "1px",
            }}
          >
            TOGGLE SORT
            <br />
            <span
              style={{ textShadow: sortByChamps ? "none" : "0 0 2px white" }}
            >
              alphabetically
            </span>
            <br />
            <span
              style={{ textShadow: sortByChamps ? "0 0 2px white" : "none" }}
            >
              by # champions
            </span>
          </td>
        </tr>
      </thead>
      <tbody style={{ fontSize: "11px" }}>
        <tr>
          <td></td>
          {horizontalTraits.map((htr) => (
            <td key={htr.name}>
              <p
                style={{
                  transform:
                    "translateX(calc(-1em * sin(-60deg))) rotate(-60deg)",
                  maxWidth: "1em",
                  whiteSpace: "nowrap",
                  textAlign: "start",
                  marginBottom: "0.3em",
                  marginTop: "6em",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    flexFlow: "column nowrap",
                    alignItems: "start",
                  }}
                >
                  {htr.name}
                  <img
                    src={`https://raw.communitydragon.org/latest/game/${htr.icon}`
                      .replace(".tex", ".png")
                      .toLowerCase()}
                    height={10}
                    width={10}
                  />
                </div>
              </p>
              <TotalNumber
                number={
                  championsByTrait(htr).byAnyTrait(...verticalTraits).length
                }
              />
            </td>
          ))}
        </tr>
        {verticalTraits.map((vtr, vi) => (
          <tr key={vtr.name}>
            <td
              key={vtr.name}
              style={{
                textAlign: "end",
                whiteSpace: "nowrap",
                display: "flex",
                flexFlow: "row nowrap",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  flexFlow: "column nowrap",
                  alignItems: "end",
                }}
              >
                {vtr.name}
                <img
                  src={`https://raw.communitydragon.org/latest/game/${vtr.icon}`
                    .replace(".tex", ".png")
                    .toLowerCase()}
                  height={10}
                  width={10}
                />
              </div>
              <TotalNumber
                number={
                  championsByTrait(vtr).byAnyTrait(...horizontalTraits).length
                }
              />
            </td>
            {horizontalTraits.map((htr, hi) => (
              <td key={htr.name}>
                {symmetric && horizontalTraits.length - hi - 1 === vi ? (
                  <div
                    style={{
                      borderLeft: "1px solid red",
                      transform: "rotate(45deg)",
                      height: "1em",
                      width: "1em",
                      display: "inline-block",
                      transformOrigin: "bottom left",
                    }}
                  />
                ) : (
                  <Square
                    champions={championsByTrait(htr).byTrait(vtr).champions}
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row wrap",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Table
        horizontalTraits={originTraits}
        verticalTraits={typeTraits}
        symmetric={false}
      />
      <Table
        horizontalTraits={originTraits3Unique}
        verticalTraits={originTraits3Unique}
        symmetric={true}
      />
      <Table
        horizontalTraits={typeTraits3Unique}
        verticalTraits={typeTraits3Unique}
        symmetric={true}
      />
    </div>
  );
}

export default App;
