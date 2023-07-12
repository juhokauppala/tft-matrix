export const TotalNumber = ({ number }: { number: number }) => {
  return (
    <span
      style={{
        textShadow: "0 0 2px white",
        backgroundImage:
          "radial-gradient(circle, rgba(0, 0, 0, 0.7) 5%, rgba(0,0,0,0) 70%)",
        fontSize: "1.2em",
        width: "1.5em",
        height: "1.5em",
        display: "inline-block",
        textAlign: "center",
        userSelect: "none",
      }}
    >
      {number}
    </span>
  );
};
