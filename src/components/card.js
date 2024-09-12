// Card.js
export const Card = ({ children, className }) => (
    <div className={`p-4 bg-white rounded-lg shadow ${className}`}>{children}</div>
  );
  
  export const CardHeader = ({ children, className }) => (
    <div className={`border-b pb-4 ${className}`}>{children}</div>
  );
  
  export const CardTitle = ({ children, className }) => (
    <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
  );
  
  export const CardContent = ({ children, className }) => (
    <div className={`p-4 ${className}`}>{children}</div>
  );
  