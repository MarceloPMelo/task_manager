import { useState } from "react";
import { Check, Trash2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  jobTitle: string;
  address: string;
  userId: string;
}


interface ContactCardProps {
  contact: Contact;
  onDelete: (id: string) => void;
}

export function ContactCard({ contact, onDelete }: ContactCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card
      className={"group relative border-border/50 transition-all duration-200 hover:shadow-md hover:border-primary/20"}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-3">
          <div className="flex-1 min-w-0">
            <h3
              className={"font-medium text-foreground transition-colors"}
            >
              {contact.name}
            </h3>
            
            {/* Description on hover */}
            {contact.email && (
              <div
                className={cn(
                  "mt-2 text-sm text-muted-foreground transition-all duration-200 overflow-hidden",
                  showDetails ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="leading-relaxed">{contact.email}</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(contact.id)}
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