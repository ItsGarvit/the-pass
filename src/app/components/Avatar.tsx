import { User } from "../contexts/AuthContext";

interface AvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-xl",
  xl: "w-28 h-28 text-4xl",
};

export function Avatar({ user, size = "md", className = "" }: AvatarProps) {
  if (!user) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold ${className}`}
      >
        ?
      </div>
    );
  }

  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt={user.fullName}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white dark:border-gray-700 ${className}`}
        onError={(e) => {
          // Fallback if image fails to load
          e.currentTarget.style.display = "none";
          const fallback = document.createElement("div");
          fallback.className = `${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold`;
          fallback.textContent = user.fullName.split(" ").map((n) => n[0]).join("");
          e.currentTarget.parentElement?.appendChild(fallback);
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold ${className}`}
    >
      {user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
  );
}
