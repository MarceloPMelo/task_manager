import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface TaskFormProps {
  onAddTask: (task: { title: string; description: string }) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título da task é obrigatório",
        variant: "destructive",
      });
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim(),
    });

    setTitle("");
    setDescription("");
    
    toast({
      title: "Sucesso",
      description: "Task adicionada com sucesso!",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Plus className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Nova Task</h2>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Título da task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background border-border/50 focus:border-primary"
            />
          </div>
          <div>
            <Textarea
              placeholder="Descrição da task (opcional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-border/50 focus:border-primary min-h-[100px] resize-none"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}