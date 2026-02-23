export default function StatusBadge({ status }) {
  const colors = {
    CREATED: "bg-blue-200 text-blue-800",
    IN_PROGRESS: "bg-yellow-200 text-yellow-800",
    WAITING_PARTS: "bg-orange-200 text-orange-800",
    COMPLETED: "bg-green-200 text-green-800",
    DELIVERED: "bg-gray-300 text-gray-800",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[status]}`}>
      {status}
    </span>
  );
}
