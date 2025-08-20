export function Card({ children, className = "" }) {
    return (
      <div className={`rounded-xl shadow-md border p-4 bg-white ${className}`}>
        {children}
      </div>
    )
  }
  
  export function CardContent({ children, className = "" }) {
    return (
      <div className={`mt-2 ${className}`}>
        {children}
      </div>
    )
  }
  