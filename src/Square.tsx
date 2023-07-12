import { useState } from "react";
import { ColorScale } from "./ColorScale";
import { TotalNumber } from "./TotalNumber";

type SquareProps = {
  champions: Champion[];
};

const color = (cost: number) => {
  switch (cost) {
    case 1:
      return "rgb(41, 49, 58)";
    case 2:
      return "rgb(15, 77, 44)";
    case 3:
      return "rgb(4, 45, 138)";
    case 4:
      return "rgb(114, 26, 84)";
    case 5:
      return "rgb(156, 103, 15)";
  }
};

export const Square = (props: SquareProps) => {
  const [lockMultiple, setLockMultiple] = useState<boolean>(false);
  const [mouseOn, setMouseOn] = useState<boolean>(false);
  const showMultiple = lockMultiple || mouseOn;

  if (props.champions.length === 1) {
    return (
      <div
        style={{
          width: "2.5em",
          height: "2.5em",
          border: `solid 1px ${color(props.champions[0].cost)}`,
          overflow: "hidden",
          borderCollapse: "separate",
          backgroundImage: `radial-gradient(circle, white 50%, ${color(
            props.champions[0].cost
          )} 90%)`,
        }}
      >
        <img
          src={`https://raw.communitydragon.org/latest/game/${props.champions[0].squareIcon}`
            .replace(".tex", ".png")
            .toLowerCase()}
          height="100%"
          width="100%"
          style={{
            transform: "scale(140%)",
            mixBlendMode: "multiply",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "2.5em",
        height: "2.5em",
        border: "solid 1px rgba(255, 255, 255, 0.6)",
        backgroundColor: ColorScale.Scale[props.champions.length],
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: props.champions.length > 0 ? "pointer" : "auto",
      }}
      onClick={() =>
        setLockMultiple((v) => {
          setMouseOn(!v);
          return !v;
        })
      }
      onMouseEnter={() => setMouseOn(true)}
      onMouseLeave={() => setMouseOn(false)}
    >
      {props.champions.length > 0 ? (
        <>
          <TotalNumber number={props.champions.length} />
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              display: showMultiple ? "flex" : "none",
              padding: "0.5em",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              bottom: "1.7em",
              left: "-1.85em",
              borderRadius: "4px",
            }}
          >
            {props.champions.map((c) => (
              <Square champions={[c]} />
            ))}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};
