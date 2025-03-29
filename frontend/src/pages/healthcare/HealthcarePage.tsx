import React, { useState, useEffect, useContext } from "react";
import { Container, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ApiClientContext } from "../../providers/ApiClientProvider";
import { SnackbarContext, SNACKBAR_SEVERITY } from "../../providers/SnackbarProvider";

interface Vet {
  id: string;
  vet_license?: string;
  vet_center?: string;
  vet_phone?: string;
}

export const HealthcarePage: React.FC = () => {
  const { appointmentsApi } = useContext(ApiClientContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableVets, setAvailableVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableVets(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableVets = async (date: string) => {
    setLoading(true);
    try {
      const response = await appointmentsApi.getAvailableVets({ query: { date } });
      if (response && response.data) {
        setAvailableVets(response.data.vets || []);
      } else {
        showSnackbar("Failed to fetch available vets", SNACKBAR_SEVERITY.ERROR);
      }
    } catch (error) {
      console.error("Error fetching available vets", error);
      showSnackbar("Error fetching available vets", SNACKBAR_SEVERITY.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedVet) return;
    try {
      const appointmentData = {
        user_id: "CURRENT_USER_UUID",
        vet_id: selectedVet.id,
        appointment_date: selectedDate,
        appointment_time: null
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
                <Button key={vet.id} onClick={() => { setSelectedVet(vet); setBookingDialogOpen(true); }}>
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
            {selectedVet && `Book an appointment with vet at ${selectedVet.vet_center || "N/A"} on ${selectedDate}.`}
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

