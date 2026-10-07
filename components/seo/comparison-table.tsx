interface ComparisonTableProps {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
  rowHeaders?: string[];
}

export default function ComparisonTable({ caption, headers, rows, rowHeaders }: ComparisonTableProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {caption && <caption className="text-lg font-semibold mb-4 text-left">{caption}</caption>}
        <thead>
          <tr className="border-b-2 border-border">
            {rowHeaders && <th className="p-3 text-left font-semibold text-muted-foreground w-1/4" />}
            {headers.map((h, i) => (
              <th key={i} scope="col" className="p-3 text-left font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b border-border even:bg-muted/50">
              {rowHeaders && (
                <th scope="row" className="p-3 font-medium text-foreground text-left">
                  {rowHeaders[rowIdx]}
                </th>
              )}
              {row.map((cell, colIdx) => (
                <td key={colIdx} className="p-3 text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
