import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ApiClientContext } from "../../providers/ApiClientProvider";
import { SnackbarContext, SNACKBAR_SEVERITY } from "../../providers/SnackbarProvider";
import { Pet } from "../../api/types/pet";

const VetPetPage = () => {
  const { appointmentsApi, petApi, userApi } = useContext(ApiClientContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const [vetId, setVetId] = useState<string | null>(null);
  const [petRecords, setPetRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchVetId = async () => {
      try {
        const response = await userApi.retrieveUser();
        if (response.success && response.data?.id) {
          setVetId(response.data.id);
        } else {
          showSnackbar("Failed to retrieve vet ID", SNACKBAR_SEVERITY.ERROR);
        }
      } catch (error) {
        console.error("Error retrieving vet ID", error);
        showSnackbar("Error retrieving vet ID", SNACKBAR_SEVERITY.ERROR);
      }
    };
    fetchVetId();
  }, [userApi]);

  useEffect(() => {
    if (!vetId) return;

    const fetchPetPatientRecords = async () => {
      setLoading(true);
      try {
        const response = await appointmentsApi.getAllAppointmentsForVet({
          query: { vet_id: vetId },
        });

        if (response.success) {
          const appointments = (response.data || []).filter((appt: any) => appt.pet_id);

          if (appointments.length === 0) {
            showSnackbar("No pet appointments found", SNACKBAR_SEVERITY.INFO);
            return;
          }

          // Extract unique pet_ids
          const uniquePetIds = Array.from(new Set(appointments.map((appt: any) => appt.pet_id)));

          // Fetch full pet records
          const petData = await Promise.all(
            uniquePetIds.map(async (petId: string) => {
              const pet = await petApi.retrievePet(petId);
              const vaccinations = await petApi.getVaccinationRecords(petId);
              const medications = await petApi.getMedicationRecords(petId);

              return {
                pet,
                vaccinations: vaccinations.success ? vaccinations.data : [],
                medications: Array.isArray(medications) ? medications : [],
              };
            })
          );

          setPetRecords(petData);
        } else {
          showSnackbar("Failed to fetch appointments", SNACKBAR_SEVERITY.ERROR);
        }
      } catch (error) {
        console.error("Error fetching pet records", error);
        showSnackbar("Error fetching pet records", SNACKBAR_SEVERITY.ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchPetPatientRecords();
  }, [vetId, appointmentsApi, petApi, showSnackbar]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>
          Pet Patient Records
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : petRecords.length === 0 ? (
          <Typography>No pet records found.</Typography>
        ) : (
          <Box>
            {petRecords.map(({ pet, vaccinations, medications }, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="h6">{pet.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Breed: {pet.breed} | Age: {pet.age} years
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Vaccinations</Typography>
                <List dense>
                  {vaccinations.length > 0 ? (
                    vaccinations.map((v: { name: string }, idx: number) => (
                      <ListItem key={idx}>
                        <ListItemText primary={v.name} />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No vaccination records." />
                    </ListItem>
                  )}
                </List>

                <Typography variant="subtitle1">Medications</Typography>
                <List dense>
                  {medications.length > 0 ? (
                    medications.map((m: { name: string; dosage: string }, idx: number) => (
                      <ListItem key={idx}>
                        <ListItemText primary={m.name} secondary={`Dosage: ${m.dosage}`} />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No medication records." />
                    </ListItem>
                  )}
                </List>

                <Divider sx={{ my: 3 }} />
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default VetPetPage;
