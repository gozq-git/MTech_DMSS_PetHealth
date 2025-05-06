import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ApiClientContext } from "../../providers/ApiClientProvider";
import { SnackbarContext, SNACKBAR_SEVERITY } from "../../providers/SnackbarProvider";
import { useNavigate } from "react-router-dom";
import { Pet } from "../../api/types/pet"; // adjust path if needed

interface Vet {
  id: string;
  vet_license?: string;
  vet_center?: string;
  vet_phone?: string;
  vet_name?: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  vet_id: string;
  status: string;
}

export const HealthcarePage: React.FC = () => {
  const { appointmentsApi, availabilitiesApi, userApi, petApi } = useContext(ApiClientContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const navigate = useNavigate();

  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableVets, setAvailableVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);

  console.log("Inside HealthcarePage. userApi:", userApi);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userApi || !userApi.retrieveUser) {
          console.error("userApi is not defined or improperly injected");
          return;
        }
  
        console.log("Calling retrieveUser...");
        const result = await userApi.retrieveUser();
        console.log("User result:", result);
  
        if (result.success && result.data) {
          const id = result.data.id;
          console.log("result.data.id:", id);
  
          setUserId(id);
          fetchUserAppointments(id);
          console.log("Calling fetchUserPets with ID:", id);
          fetchUserPets(id);
        } else {
          console.error("Failed to fetch user data:", result.message);
        }
      } catch (error) {
        console.error("Error retrieving user:", error);
      }
    };
  
    fetchUserData();
  }, [userApi]);
  

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableVets(selectedDate);
    } else {
      setAvailableVets([]);
    }
  }, [selectedDate]);

  const fetchUserAppointments = async (id: string) => {
    try {
      const response = await appointmentsApi.getAppointmentsForUser({ query: { user_id: id } });
      if (response.success && response.data) {
        setUserAppointments(
          response.data.map((appointment: any) => ({
            ...appointment,
            appointment_time: appointment.appointment_time || "",
          }))
        );
      } else {
        showSnackbar("Failed to fetch appointments", SNACKBAR_SEVERITY.ERROR);
      }
    } catch (error) {
      console.error("Error fetching user appointments:", error);
      showSnackbar("Error fetching appointments", SNACKBAR_SEVERITY.ERROR);
    }
  };

  const fetchUserPets = async (ownerId: string) => {
    try {
      const result = await petApi.getPetsByOwnerId(ownerId);
      if (result.success && result.data) {
        setPets(result.data as Pet[]);
      } else {
        showSnackbar("Failed to fetch pets", SNACKBAR_SEVERITY.ERROR);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
      showSnackbar("Error fetching pets", SNACKBAR_SEVERITY.ERROR);
    }
  };

  const fetchAvailableVets = async (date: string) => {
    setLoading(true);
    setAvailableVets([]);

    try {
      const response = await availabilitiesApi.getAvailableVets({ query: { date } });

      if (!response || !response.data) {
        showSnackbar("Invalid API response format", SNACKBAR_SEVERITY.ERROR);
        return;
      }

      const vetsData = response.data;

      if (Array.isArray(vetsData) && vetsData.length > 0) {
        const selectedDay = new Date(date).toISOString().split("T")[0];

        const vets = vetsData
          .filter((item: any) => {
            const vetDate = new Date(item.available_date).toISOString().split("T")[0];
            return vetDate === selectedDay;
          })
          .map((item: any) => ({
            id: item.VET.id,
            vet_center: item.VET.vet_center,
            vet_license: item.VET.vet_license,
            vet_phone: item.VET.vet_phone,
            vet_name: item.VET.vet_name
          }));

        setAvailableVets(vets);
      } else {
        showSnackbar("No vets available on this day.", SNACKBAR_SEVERITY.WARNING);
      }
    } catch (error) {
      console.error("Error fetching available vets:", error);
      showSnackbar("Error fetching available vets", SNACKBAR_SEVERITY.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate) {
      showSnackbar("Please select a date for the appointment", SNACKBAR_SEVERITY.ERROR);
      return;
    }
    if (!selectedTime) {
      showSnackbar("Please choose a time for the appointment", SNACKBAR_SEVERITY.ERROR);
      return;
    }
    if (!selectedVet) {
      showSnackbar("Please select a vet", SNACKBAR_SEVERITY.ERROR);
      return;
    }
    if (!userId) {
      showSnackbar("User ID missing. Please log in again.", SNACKBAR_SEVERITY.ERROR);
      return;
    }

    const selectedPet = pets.find((pet) => pet.id === selectedPetId);

    const appointmentData = {
      user_id: userId,
      vet_id: selectedVet.id,
      pet_id: selectedPet?.id || "",
      pet_name: selectedPet?.name || "",
      appointment_date: selectedDate,
      appointment_time: selectedTime,
    };

    try {
      const response = await appointmentsApi.bookAppointment(appointmentData);
      if (response.success) {
        showSnackbar("Appointment booked successfully!", SNACKBAR_SEVERITY.SUCCESS);
        setBookingDialogOpen(false);
        fetchUserAppointments(userId);
      } else {
        showSnackbar("Failed to book appointment", SNACKBAR_SEVERITY.ERROR);
      }
    } catch (error) {
      console.error("Error booking appointment", error);
      showSnackbar("Error booking appointment", SNACKBAR_SEVERITY.ERROR);
    }
  };

  const handleJoinCall = (appointmentId: string) => {
    if (appointmentId) {
      navigate(`/teleconsultation?appointmentId=${appointmentId}`);
    } else {
      showSnackbar("Cannot Join Call without Appointment", SNACKBAR_SEVERITY.ERROR);
    }
  };

  const formatTime = (time: string) => {
    if (!time) return "Not specified";

    const match = time.match(/T(\d{2}):(\d{2})/);
    if (!match) return "Not specified";

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = hours >= 12 ? "PM" : "AM";

    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: '#ffffff' }}>
        <Typography variant="h4" gutterBottom fontWeight={600} color="primary.main">
          Book an Appointment
        </Typography>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          dateClick={(info) => setSelectedDate(info.dateStr)}
          height="auto"
        />

        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          <>
            <Typography variant="h6" sx={{ mt: 4 }} fontWeight={500}>
              Available Vets on {selectedDate || "—"}
            </Typography>
            {availableVets.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                No vets available on this day.
              </Typography>
            ) : (
              <Paper elevation={1} sx={{ p: 2, mt: 2, borderRadius: 2, backgroundColor: "#ffffff" }}>
                {availableVets.map((vet) => (
                  <Button
                    key={vet.id}
                    variant="outlined"
                    color="primary"
                    sx={{ m: 1 }}
                    onClick={() => {
                      setSelectedVet(vet);
                      setBookingDialogOpen(true);
                    }}
                  >
                    {vet.vet_name || "Unknown Vet"} ({vet.vet_center || "N/A"})
                  </Button>
                ))}
              </Paper>
            )}
          </>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mt: 6, borderRadius: 4, backgroundColor: '#ffffff' }}>
        <Typography variant="h5" gutterBottom fontWeight={600} color="primary.main">
          Your Appointments
        </Typography>

        {userAppointments.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No appointments found.
          </Typography>
        ) : (
          userAppointments.map((appointment) => {
            const vet = availableVets.find(vet => vet.id === appointment.vet_id);
            return (
              <Paper
                key={appointment.id}
                elevation={2}
                sx={{
                  p: 3,
                  mt: 2,
                  borderLeft: 4,
                  borderColor: "primary.main",
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography>
                  <strong>Date:</strong>{" "}
                  {new Date(appointment.appointment_date).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Time:</strong> {formatTime(appointment.appointment_time)}
                </Typography>
                <Typography>
                  <strong>Vet Name:</strong> {vet?.vet_name || "N/A"}
                </Typography>
                <Typography>
                  <strong>Vet Center:</strong> {vet?.vet_center || "N/A"}
                </Typography>
                <Typography>
                  <strong>Status:</strong> {appointment.status}
                </Typography>
                {appointment.status === "accepted" && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleJoinCall(appointment.id)}
                  >
                    Join Call
                  </Button>
                )}
              </Paper>
            );
          })
        )}
      </Paper>

      <Dialog
        open={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, backgroundColor: "#ffffff" } }}
      >
        <DialogTitle fontWeight={600}>Confirm Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedVet &&
              `Book an appointment with vet at ${selectedVet.vet_center || "N/A"} on ${selectedDate}.`}
          </Typography>

          <TextField
            type="time"
            label="Appointment Time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            fullWidth
            sx={{ mt: 3 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

<FormControl fullWidth sx={{ mt: 3 }}>
  <InputLabel id="select-pet-label">Select Pet</InputLabel>
  <Select
    labelId="select-pet-label"
    value={selectedPetId}
    label="Select Pet"
    onChange={(e) => setSelectedPetId(e.target.value)}
  >
    {pets.map((pet) => (
      <MenuItem key={pet.id} value={pet.id}>
        {pet.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setBookingDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleBookAppointment} variant="contained" color="primary">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HealthcarePage;
