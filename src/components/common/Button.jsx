export default function Button({ children, onClick, type = "button", variant = "dark" }) {
  const styles = {
    dark: "bg-black text-white",
    green: "bg-green-600 text-white",
    red: "bg-red-600 text-white",
    outline: "border border-black",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
