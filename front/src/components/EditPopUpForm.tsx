import * as React from 'react';
import { DialogTitle, DialogContent, DialogActions, TextField, Button, Dialog } from '@mui/material';
import type { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from "react-redux";
import type { ContactInput } from "../types/ContactInput";
import { updateContact } from '@/store/contactSlice';

type EditPopUpFormProps = {
  contactId: number;
  open: boolean;
  onClose: () => void;
};

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

  React.useEffect(() => {
    setFormData({
      name: contact?.name ?? '',
      email: contact?.email ?? '',
      phone: contact?.phone ?? '',
      address: contact?.address ?? '',
      jobTitle: contact?.jobTitle ?? '',
      company: contact?.company ?? '',
    });
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(contactId);
    console.log(formData);
    dispatch(updateContact({ contactId: contactId, updateContent: formData }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar informações</DialogTitle>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit}>
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
