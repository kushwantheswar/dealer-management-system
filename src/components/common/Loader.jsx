export default function Loader({ text = "Loading..." }) {
  return (
    <div className="p-6 text-center text-gray-600">
      {text}
    </div>
  );
}
