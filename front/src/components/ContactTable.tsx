// src/components/ContactTable.tsx
import type { Contact } from "../types/Contact";
import { Button } from "@/components/ui/button";

interface ContactTableProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
}

export function ContactTable({ contacts, onDelete }: ContactTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum contato encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-border/50 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Telefone</th>
            <th className="px-4 py-2 text-left">Empresa</th>
            <th className="px-4 py-2 text-left">Cargo</th>
            <th className="px-4 py-2 text-left">Endereço</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id} className="border-t border-border/30 hover:bg-gray-50">
              <td className="px-4 py-2">{contact.name}</td>
              <td className="px-4 py-2">{contact.email}</td>
              <td className="px-4 py-2">{contact.phone}</td>
              <td className="px-4 py-2">{contact.company}</td>
              <td className="px-4 py-2">{contact.jobTitle}</td>
              <td className="px-4 py-2">{contact.address}</td>
              <td className="px-4 py-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(contact.id)}
                >
                  Deletar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
