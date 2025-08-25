export function Button({ children, onClick, className = "", variant = "primary", ...props }) {
  const base = "px-4 py-2 rounded-lg font-medium transition-colors duration-200";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
