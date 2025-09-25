import { useState } from "react";
import { Check, Trash2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  description: string;
  done: boolean;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <Card
      className={cn(
        "group relative border-border/50 transition-all duration-200 hover:shadow-md hover:border-primary/20",
        task.done && "opacity-75"
      )}
      onMouseEnter={() => setShowDescription(true)}
      onMouseLeave={() => setShowDescription(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-3">
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-medium text-foreground transition-colors",
                task.done && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>
            
            {/* Description on hover */}
            {task.description && (
              <div
                className={cn(
                  "mt-2 text-sm text-muted-foreground transition-all duration-200 overflow-hidden",
                  showDescription ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="leading-relaxed">{task.description}</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Complete Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleComplete(task.id)}
              className={cn(
                "h-8 w-8 p-0 hover:bg-success/10",
                task.done && "text-success hover:text-success"
              )}
            >
              {task.done ? (
                <Check className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </Button>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}