export const ColorScale = () => {
  return (
    <table>
      <tbody>
        {ColorScale.Scale.map((c, i) => (
          <tr key={i}>
            <td>{i}</td>
            <td style={{ backgroundColor: c }}></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

ColorScale.Scale = ["rgba(0,0,0,0)", "#093b96", "rgb(166, 146, 209)"];
