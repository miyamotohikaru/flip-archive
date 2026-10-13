/**
 * 用語と扱いの対応を示す表。
 * 箇条書きだと左右が離れて対応が読めないので、罫で組んだ表にする。
 */
export default function DefTable({
  head,
  rows,
}: {
  head: [string, string];
  rows: [string, string][];
}) {
  return (
    <div className="max-w-[46rem] overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-y border-ink">
            <th
              scope="col"
              className="tag w-[6rem] py-2 pr-4 align-top sm:w-[9rem] sm:pr-6"
            >
              {head[0]}
            </th>
            <th scope="col" className="tag py-2 align-top">
              {head[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-line align-top">
              <th
                scope="row"
                className="py-4 pr-4 text-left text-13 font-medium sm:pr-6"
              >
                {k}
              </th>
              <td className="copy-sm py-4">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
