import { Loader2, Clock, CheckCircle, XCircle } from "lucide-react";

const statusStyles = {
  queued: {
    color: "bg-gray-100 text-gray-800",
    icon: <Clock className="w-4 h-4 text-gray-500" />,
    label: "In Queue",
  },
  analyzing: {
    color: "bg-yellow-100 text-yellow-800",
    icon: <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />,
    label: "Analyzing",
  },
  completed: {
    color: "bg-transparent ",
    icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    label: "Completed",
  },
  failed: {
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="w-4 h-4 text-red-600" />,
    label: "Failed",
  },
};

export function StatusBadge({ status }: { status: keyof typeof statusStyles }) {
  const { color, icon, label } = statusStyles[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs shadow-xs shadow-night ${color}`}>
      {icon}
      {label}
    </span>
  );
}
