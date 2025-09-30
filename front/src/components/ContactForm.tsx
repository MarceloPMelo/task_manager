import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

interface Errors {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  address?: string;
}

export function ContactForm({ onAddContact }: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    else if (name.length > 50) newErrors.name = "Nome deve ter até 50 caracteres";

    if (!phone.trim()) newErrors.phone = "Telefone é obrigatório";
    else if (!/^\d{8,}$/.test(phone)) newErrors.phone = "Telefone inválido (mínimo 8 números)";

    if (!email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email inválido";

    if (!company.trim()) newErrors.company = "Empresa é obrigatória";
    else if (company.length > 50) newErrors.company = "Empresa deve ter até 50 caracteres";

    if (!jobTitle.trim()) newErrors.jobTitle = "Cargo é obrigatório";

    if (!address.trim()) newErrors.address = "Endereço é obrigatório";
    else if (address.length > 200) newErrors.address = "Endereço deve ter até 200 caracteres";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onAddContact({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      address: address.trim(),
    });

    setName("");
    setPhone("");
    setEmail("");
    setCompany("");
    setJobTitle("");
    setAddress("");
    setErrors({});
  };

  const renderField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    error?: string,
    type: string = "text",
    placeholder: string = ""
  ) => (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}</label>
      {error && <span className="text-red-600 text-sm mb-1">{error}</span>}
      {type === "textarea" ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`bg-background border ${
            error ? "border-red-600" : "border-border/50"
          } focus:border-primary min-h-[80px] resize-none`}
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`bg-background border ${
            error ? "border-red-600" : "border-border/50"
          } focus:border-primary`}
        />
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto border-border/50 shadow-sm">
      <CardHeader className="pb-4 flex items-center space-x-2">
        <h2 className="text-lg font-semibold text-foreground ">Novo Contato</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderField("Nome", name, setName, errors.name, "text", "Digite o nome")}
          {renderField("Telefone", phone, setPhone, errors.phone, "text", "Digite o telefone")}
          {renderField("Email", email, setEmail, errors.email, "email", "Digite o email")}
          {renderField("Empresa", company, setCompany, errors.company, "text", "Digite a empresa")}
          {renderField("Cargo", jobTitle, setJobTitle, errors.jobTitle, "text", "Digite o cargo")}
          {renderField("Endereço", address, setAddress, errors.address, "textarea", "Digite o endereço")}

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
