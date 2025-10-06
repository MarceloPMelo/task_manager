import { Formik, Form } from "formik";
import * as Yup from "yup";
import type { ContactInput } from "../types/ContactInput";
import {
    Box,
    TextField,
    Button,
    IconButton,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    OutlinedInput,
} from "@mui/material";
import { yellow } from "@mui/material/colors";


export function Search() {
    return (
        <Box sx={{
            backgroundColor: "yellow",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end"

        }} maxWidth="lg" mx="auto" px={2} py={4}>
            <Box sx={{
                backgroundColor: "blue", // cor de fundo azul
                width: 200,               // largura de 200px
                height: 100,              // altura de 100px
                color: "white",           // cor do texto branca
                display: "flex",          // centralizar texto
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2            // bordas arredondadas
            }}
            > Box Azul </Box>

            <Box sx={{
                backgroundColor: "green", // cor de fundo azul
                width: 200,               // largura de 200px
                height: 100,              // altura de 100px
                color: "white",           // cor do texto branca
                display: "flex",          // centralizar texto
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2            // bordas arredondadas
            }}
            > Box verde </Box>
        </Box>
    );
}