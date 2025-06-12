import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const Loader = ({ size = "md", className, ...props }: LoaderProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  }

  return (
    <div className="flex items-center justify-center" {...props}>
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-primary",
          sizeClasses[size],
          className
        )}
      />
    </div>
  )
}

export default Loader 