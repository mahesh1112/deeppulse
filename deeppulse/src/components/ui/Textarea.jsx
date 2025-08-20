export function Textarea({ className = "", ...props }) {
    return (
      <textarea
        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    )
  }
  