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
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ApiClientContext } from "../../providers/ApiClientProvider";
import { SnackbarContext, SNACKBAR_SEVERITY } from "../../providers/SnackbarProvider";

interface Vet {
  id: string;
  vet_license?: string;
  vet_center?: string;
  vet_phone?: string;
}

export const HealthcarePage: React.FC = () => {
  const { appointmentsApi, userApi } = useContext(ApiClientContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableVets, setAvailableVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await userApi.retrieveUser();
        if (result.success && result.data) {
          setUserId(result.data.id);
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
    }
  }, [selectedDate]);

  const fetchAvailableVets = async (date: string) => {
    setLoading(true);
    try {
      const response = await appointmentsApi.getAvailableVets({ query: { date } });

      console.log("Raw API Response:", response);

      if (!response || !response.data) {
        showSnackbar("Invalid API response format", SNACKBAR_SEVERITY.ERROR);
        return;
      }

      const vetsData = response.data;

      console.log("Extracted Vets Data:", vetsData);

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
    if (!selectedDate || !selectedVet || !userId) {
      showSnackbar("Error: Missing user ID or appointment details", SNACKBAR_SEVERITY.ERROR);
      return;
    }

    console.log("Booking appointment with the following details:");
    console.log("User ID:", userId);
    console.log("Selected Vet:", selectedVet);
    console.log("Vet ID being sent:", selectedVet.id);
    console.log("Appointment Date:", selectedDate);

    try {
      const appointmentData = {
        user_id: userId,
        vet_id: selectedVet.id,
        appointment_date: selectedDate,
        appointment_time: null,
      };

      const response = await appointmentsApi.bookAppointment(appointmentData);
      if (response.success) {
        showSnackbar("Appointment booked successfully!", SNACKBAR_SEVERITY.SUCCESS);
        setBookingDialogOpen(false);
      } else {
        showSnackbar("Failed to book appointment", SNACKBAR_SEVERITY.ERROR);
      }
    } catch (error) {
      console.error("Error booking appointment", error);
      showSnackbar("Error booking appointment", SNACKBAR_SEVERITY.ERROR);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book an Appointment
        </Typography>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          dateClick={(info) => setSelectedDate(info.dateStr)}
        />
        {loading ? (
          <CircularProgress sx={{ mt: 2 }} />
        ) : (
          <>
            <Typography variant="h6" sx={{ mt: 3 }}>
              Available Vets on {selectedDate || ""}
            </Typography>
            {availableVets.length === 0 ? (
              <Typography variant="body1">No vets available on this day.</Typography>
            ) : (
              availableVets.map((vet) => (
                <Button
                  key={vet.id}
                  onClick={() => {
                    console.log("Vet selected:", vet);
                    setSelectedVet(vet);
                    setBookingDialogOpen(true);
                  }}
                >
                  {vet.vet_center || "N/A"} (License: {vet.vet_license || "N/A"})
                </Button>
              ))
            )}
          </>
        )}
      </Paper>

      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)}>
        <DialogTitle>Confirm Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedVet &&
              `Book an appointment with vet at ${selectedVet.vet_center || "N/A"} on ${selectedDate}.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBookAppointment} variant="contained" color="primary">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HealthcarePage;
