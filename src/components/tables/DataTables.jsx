export default function DataTable({ columns, data }) {
  return (
    <table className="w-full text-sm bg-white rounded shadow">
      <thead className="bg-gray-200">
        <tr>
          {columns.map((col) => (
            <th key={col} className="p-2 text-left">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="p-4 text-center">
              No data
            </td>
          </tr>
        )}
        {data.map((row, i) => (
          <tr key={i} className="border-t">
            {Object.values(row).map((val, j) => (
              <td key={j} className="p-2">{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
