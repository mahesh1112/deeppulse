export function Button({ children, onClick, className = "", ...props }) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
  