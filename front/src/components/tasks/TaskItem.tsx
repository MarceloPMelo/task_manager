import { CheckCircle, Circle } from "lucide-react";

interface TaskCardProps {
  title: string;
  description: string;
  done: boolean;
}

const TaskCard = ({ title, description, done }: TaskCardProps) => {
  return (
    <div
      className="flex items-start gap-3 p-4 bg-white shadow-md rounded-2xl border hover:shadow-lg transition"
    >
      <div className="mt-1">
        {done ? (
          <CheckCircle className="text-green-500" size={24} />
        ) : (
          <Circle className="text-gray-400" size={24} />
        )}
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default TaskCard;
