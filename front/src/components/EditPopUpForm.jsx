import { DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export default function EditPopUpForm({ contactId, onClose}) {
  return (
    <>
      <DialogTitle>Editar nome</DialogTitle>
      <DialogContent>
        <TextField
          label="Nome"
          fullWidth
          variant="outlined"
          margin="dense"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" >
          Salvar
        </Button>
      </DialogActions>
    </>
  );
}
