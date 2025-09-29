import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface ContactFormProps {
  onAddContact: (contact: {
    name: string;
    phone: string;
    email: string;
    company: string;
    jobTitle: string;
    address: string;
  }) => void;
}

export function ContactForm({ onAddContact }: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !email.trim() || !company.trim() || !jobTitle.trim() || !address.trim()) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    onAddContact({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      address: address.trim(),
    });

    // Limpa os campos
    setName("");
    setPhone("");
    setEmail("");
    setCompany("");
    setJobTitle("");
    setAddress("");

    toast({
      title: "Sucesso",
      description: "Contato adicionado com sucesso!",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Plus className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Novo Contato</h2>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background border-border/50 focus:border-primary"
          />
          <Input
            type="text"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-background border-border/50 focus:border-primary"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background border-border/50 focus:border-primary"
          />
          <Input
            type="text"
            placeholder="Empresa"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-background border-border/50 focus:border-primary"
          />
          <Input
            type="text"
            placeholder="Cargo"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="bg-background border-border/50 focus:border-primary"
          />
          <Textarea
            placeholder="Endereço"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-background border-border/50 focus:border-primary min-h-[80px] resize-none"
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Contato
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
