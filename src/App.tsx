import { Square } from "./Square";
import "./App.css";
// import { ColorScale } from "./ColorScale";
import { TotalNumber } from "./TotalNumber";
import { useState } from "react";
import { SingleSetData, useData } from "./cdragon";
import { process } from "./appLogic";

const filterFunctions = (data: SingleSetData) => {
  const championsByTrait = (
    trait: string | Trait,
    subset: Champion[] = data.champions
  ) => {
    const _trait = typeof trait === "string" ? trait : trait.name;
    const list = subset.filter((c) => c.traits.includes(_trait));
    const uniques = [
      ...new Map<string, Champion>(list.map((c) => [c.name, c])).values(),
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

  return { championsByTrait, alphaCmp, champCmp };
};

const Table = ({
  horizontalTraits,
  verticalTraits,
  symmetric,
  fns,
}: {
  horizontalTraits: Trait[];
  verticalTraits: Trait[];
  symmetric: boolean;
  fns: ReturnType<typeof filterFunctions>;
}) => {
  const [sortByChamps, setSortByChamps] = useState<boolean>(false);

  verticalTraits = verticalTraits.filter(
    (t) => fns.championsByTrait(t).byAnyTrait(...horizontalTraits).length > 0
  );
  horizontalTraits = horizontalTraits.filter(
    (t) => fns.championsByTrait(t).byAnyTrait(...verticalTraits).length > 0
  );

  if (sortByChamps) {
    horizontalTraits.sort(fns.champCmp(verticalTraits));
    verticalTraits.sort(fns.champCmp(horizontalTraits));
  } else {
    horizontalTraits.sort(fns.alphaCmp);
    verticalTraits.sort(fns.alphaCmp);
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
                  fns.championsByTrait(htr).byAnyTrait(...verticalTraits).length
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
                  fns.championsByTrait(vtr).byAnyTrait(...horizontalTraits)
                    .length
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
                    champions={fns.championsByTrait(htr).byTrait(vtr).champions}
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
  const { data } = useData();
  if (!data) return <div>loading...</div>;
  const { originTraits, typeTraits, originTraits3Unique, typeTraits3Unique } =
    process(data);

  const filterFns = filterFunctions(data);
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
        fns={filterFns}
      />
      <Table
        horizontalTraits={originTraits3Unique}
        verticalTraits={originTraits3Unique}
        symmetric={true}
        fns={filterFns}
      />
      <Table
        horizontalTraits={typeTraits3Unique}
        verticalTraits={typeTraits3Unique}
        symmetric={true}
        fns={filterFns}
      />
    </div>
  );
}

export default App;
