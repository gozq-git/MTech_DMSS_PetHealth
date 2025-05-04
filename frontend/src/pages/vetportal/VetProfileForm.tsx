// src/components/VetProfileForm.tsx
import { Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useContext, useState } from "react";
import { SNACKBAR_SEVERITY, SnackbarContext } from "../../providers/SnackbarProvider.tsx";
import Divider from "@mui/material/Divider";
import { ApiClientContext } from "../../providers/ApiClientProvider.tsx";

interface VetProfileFormValues {
  vet_license: string;
  vet_center: string;
  vet_phone: string;
}

const vetProfileFormItems = [
  { id: "vet_license", label: "License Number" },
  { id: "vet_center", label: "Veterinary Center" },
  { id: "vet_phone", label: "Veterinary Phone" },
];

export const VetProfileForm = () => {
  const { showSnackbar } = useContext(SnackbarContext);
  const { userApi } = useContext(ApiClientContext);
  const [formValues, setFormValues] = useState<VetProfileFormValues>({
    vet_license: "",
    vet_center: "",
    vet_phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    const userData = {
      vet_license: formValues.vet_license,
      vet_center: formValues.vet_center,
      vet_phone: formValues.vet_phone,
    };

    try {
      const result = await userApi.updateUser(userData);
      if (result.success) {
        showSnackbar("Vet profile updated successfully!", SNACKBAR_SEVERITY.SUCCESS);
      } else {
        showSnackbar(result.message, SNACKBAR_SEVERITY.ERROR);
      }
    } catch (error) {
      console.error("Failed to update vet profile", error);
      showSnackbar("Failed to update vet profile", SNACKBAR_SEVERITY.ERROR);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Vet Profile
        </Typography>
        <Typography variant="body1" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
          Please fill in your veterinarian information below
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Stack spacing={3}>
          {vetProfileFormItems.map((item) => (
            <TextField
              key={item.id}
              id={item.id}
              name={item.id}
              label={item.label}
              variant="outlined"
              fullWidth
              value={formValues[item.id as keyof VetProfileFormValues]}
              onChange={handleChange}
            />
          ))}
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 4 }} />
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" onClick={submitForm} sx={{ px: 4 }}>
                Submit
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};
