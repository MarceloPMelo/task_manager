import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface DeletePopUpFormProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    selectedCount: number;
}

const DeletePopUpForm: React.FC<DeletePopUpFormProps> = ({
    open,
    onClose,
    onDelete,
    selectedCount,
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Deseja realmente apagar os {selectedCount} contatos selecionados?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary">
                Cancelar
            </Button>
            <Button
                onClick={onDelete}
                autoFocus
                sx={{
                    backgroundColor: "#ffeaea",
                    color: "#d32f2f",
                    "&:hover": { backgroundColor: "#ffd6d6" },
                    width: "153px",
                }}
            >
                Apagar
            </Button>
        </DialogActions>
    </Dialog>
);

export default DeletePopUpForm;