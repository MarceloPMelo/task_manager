import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { ContactInput } from "../types/ContactInput";

import {
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Grid
} from "@mui/material";


interface ContactFormProps {
  onAddContact: (contact: ContactInput) => void;
}

export function ContactForm({ onAddContact }: ContactFormProps) {
  const initialValues: ContactInput = {
    name: "",
    phone: "",
    email: "",
    company: "",
    jobTitle: "",
    address: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    phone: Yup.string().max(20, "Must be 20 characters or less").required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    company: Yup.string().required("Required"),
    jobTitle: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
  });

  return (
    <Card sx={{ maxWidth: 600, margin: "2rem auto", padding: 2, boxShadow: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New Contact
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            onAddContact(values);
            setSubmitting(false);
            resetForm();
          }}
        >
          {({ isSubmitting, handleChange, handleBlur, values, errors, touched }) => (
            <Form>
              <Grid container display="flex" spacing={2} justifyContent="center">
                <Grid >
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                <Grid >
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>

                <Grid >
                  <TextField
                    fullWidth
                    label="Company"
                    name="company"
                    value={values.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.company && Boolean(errors.company)}
                    helperText={touched.company && errors.company}
                  />
                </Grid>

                <Grid >
                  <TextField
                    fullWidth
                    label="Job Title"
                    name="jobTitle"
                    value={values.jobTitle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.jobTitle && Boolean(errors.jobTitle)}
                    helperText={touched.jobTitle && errors.jobTitle}
                  />
                </Grid>

                <Grid >
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid>

                <Grid >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Add Contact
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
