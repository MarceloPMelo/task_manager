import * as React from 'react';
import { DialogTitle, DialogContent, DialogActions, TextField, Button, Dialog } from '@mui/material';
import type { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from "react-redux";
import type { ContactInput } from "../types/ContactInput";
import { updateContact, setSelectedContactsId } from '@/store/contactSlice';

type EditPopUpFormProps = {
  contactId: number;
  open: boolean;
  onClose: () => void;
};

type Errors = Partial<Record<keyof ContactInput, string>>;

function validate(formData: ContactInput): Errors {
  const errors: Errors = {};
  if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
  if (!formData.email.trim()) errors.email = 'Email é obrigatório';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido';
  if (!formData.phone.trim()) errors.phone = 'Telefone é obrigatório';
  if (!formData.address.trim()) errors.address = 'Endereço é obrigatório';
  if (!formData.jobTitle.trim()) errors.jobTitle = 'Cargo é obrigatório';
  if (!formData.company.trim()) errors.company = 'Empresa é obrigatória';
  return errors;
}

export function EditPopUpForm({ contactId, open, onClose }: EditPopUpFormProps) {

  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  const dispatch = useDispatch<AppDispatch>();
  const contact = contacts.find(c => c.id === contactId);

  const [formData, setFormData] = React.useState<ContactInput>({
    name: contact?.name ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    address: contact?.address ?? '',
    jobTitle: contact?.jobTitle ?? '',
    company: contact?.company ?? '',
  });

  const [errors, setErrors] = React.useState<Errors>({});

  React.useEffect(() => {
    setFormData({
      name: contact?.name ?? '',
      email: contact?.email ?? '',
      phone: contact?.phone ?? '',
      address: contact?.address ?? '',
      jobTitle: contact?.jobTitle ?? '',
      company: contact?.company ?? '',
    });
    setErrors({});
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    dispatch(updateContact({ contactId: contactId, updateContent: formData }));
    dispatch(setSelectedContactsId([]));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar informações</DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent>
          {[
            { name: 'name', label: 'Nome', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Telefone', type: 'tel' },
            { name: 'address', label: 'Endereço', type: 'text' },
            { name: 'jobTitle', label: 'Cargo', type: 'text' },
            { name: 'company', label: 'Empresa', type: 'text' },
          ].map(field => (
            <TextField
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              value={formData[field.name as keyof ContactInput]}
              onChange={handleChange}
              fullWidth
              margin="dense"
              variant="outlined"
              error={!!errors[field.name as keyof ContactInput]}
              helperText={errors[field.name as keyof ContactInput] || ''}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
