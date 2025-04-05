import React, { useState, useEffect, useContext } from "react"; 
import { 
  Container, Paper, Typography, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, CircularProgress, TextField 
} from "@mui/material";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ApiClientContext } from "../../providers/ApiClientProvider";
import { SnackbarContext, SNACKBAR_SEVERITY } from "../../providers/SnackbarProvider";

interface Appointment {
  id: string;
  user_id: string;
  appointment_date: string;
  status: "pending" | "accepted" | "rejected";
}

export const VetHealthcarePage: React.FC = () => {
  const { appointmentsApi, availabilitiesApi, userApi } = useContext(ApiClientContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const [vetId, setVetId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availabilityDates, setAvailabilityDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [availabilityLoading, setAvailabilityLoading] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");

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
  }, []);

  useEffect(() => {
    if (vetId) {
      fetchAvailability();
    }
  }, [vetId]);

  useEffect(() => {
    if (selectedDate && vetId) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate, vetId]);

  const fetchAppointments = async (date: string) => {
    if (!vetId) return;
    setLoading(true);
    try {
      const response = await appointmentsApi.getAppointmentsForVet({ query: { date, vet_id: vetId } });
      if (response.success) {
        setAppointments(response.data || []);
      } else {
        showSnackbar("Failed to fetch appointments", SNACKBAR_SEVERITY.ERROR);
      }
    } catch (error) {
      console.error("Error fetching appointments", error);
      showSnackbar("Error fetching appointments", SNACKBAR_SEVERITY.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    if (!vetId) return;
    try {
      const response = await availabilitiesApi.getAvailabilityForVet({ query: { vet_id: vetId } });
      if (response.success && response.data) {
        const dates = response.data.map((item: any) =>
          new Date(item.available_date).toISOString().split("T")[0]
        );
        setAvailabilityDates(dates);
      } else {
        showSnackbar("Failed to fetch availability", SNACKBAR_SEVERITY.ERROR);
      }
    } catch (error) {
      console.error("Error fetching availability", error);
      showSnackbar("Error fetching availability", SNACKBAR_SEVERITY.ERROR);
    }
  };

  const markAvailability = async (date: string) => {
    if (!vetId) return;
    setAvailabilityLoading(true);
    try {
      const response = await availabilitiesApi.markAvailability({ vet_id: vetId, available_date: date });
      if (response.success) {
        showSnackbar("Availability marked successfully", SNACKBAR_SEVERITY.SUCCESS);
        fetchAvailability();
      } else {
        showSnackbar("Failed to mark availability", SNACKBAR_SEVERITY.ERROR);
      }
    } catch (error) {
      console.error("Error marking availability", error);
      showSnackbar("Error marking availability", SNACKBAR_SEVERITY.ERROR);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleRespondAppointment = async (status: "accepted" | "rejected") => {
    if (!selectedAppointment) return;
    try {
      const response = await appointmentsApi.respondAppointment({
        appointment_id: selectedAppointment.id,
        status,
        rejection_reason: status === "rejected" ? rejectionReason : undefined,
      });
      if (response.success) {
        showSnackbar("Appointment updated successfully", SNACKBAR_SEVERITY.SUCCESS);
        if (selectedDate) fetchAppointments(selectedDate);
        setResponseDialogOpen(false);
      } else {
        showSnackbar("Failed to update appointment", SNACKBAR_SEVERITY.ERROR);
      }
    } catch (error) {
      console.error("Error updating appointment", error);
      showSnackbar("Error updating appointment", SNACKBAR_SEVERITY.ERROR);
    }
  };

  const getAppointmentsForCalendar = () => {
    return appointments.map((appointment) => ({
      title: `Appointment with user ${appointment.user_id}`,
      date: appointment.appointment_date,
      backgroundColor: appointment.status === 'accepted' ? 'green' : appointment.status === 'rejected' ? 'red' : 'yellow',
      borderColor: appointment.status === 'accepted' ? 'darkgreen' : appointment.status === 'rejected' ? 'darkred' : 'orange',
      textColor: 'white',
      extendedProps: {
        appointmentId: appointment.id,
      },
    }));
  };

  const getAvailabilityEvents = () => {
    return availabilityDates.map((date) => ({
      start: date,
      display: "background",
      backgroundColor: "#d0f0c0",
    }));
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, width: "100%" }}> 
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Vet Availability & Appointments
        </Typography>
        <div style={{ width: "100%", maxWidth: "100%" }}>
          <FullCalendar
            key={appointments.length + availabilityDates.length}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true}
            dateClick={(info) => setSelectedDate(info.dateStr)}
            events={[
              ...getAppointmentsForCalendar(),
              ...getAvailabilityEvents(),
            ]}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => selectedDate && markAvailability(selectedDate)}
          disabled={availabilityLoading}
          sx={{ mt: 2 }}
        >
          {availabilityLoading ? "Marking..." : "Mark Availability for Selected Date"}
        </Button>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Appointments on {selectedDate || ""}
        </Typography>
        {loading ? <CircularProgress sx={{ mt: 2 }} /> : (
          appointments.length === 0 ? (
            <Typography variant="body1" sx={{ color: "red" }}>
              No appointments on this day.
            </Typography>
          ) : (
            appointments.map((appointment) => (
              <Button
                key={appointment.id}
                onClick={() => { setSelectedAppointment(appointment); setResponseDialogOpen(true); }}
              >
                Appointment with user {appointment.user_id} ({appointment.status})
              </Button>
            ))
          )
        )}
      </Paper>

      <Dialog open={responseDialogOpen} onClose={() => setResponseDialogOpen(false)}>
        <DialogTitle>Respond to Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedAppointment && `Appointment from user ${selectedAppointment.user_id}`}
          </Typography>
          <TextField
            fullWidth
            label="Rejection Reason"
            variant="outlined"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={() => handleRespondAppointment("accepted")} variant="contained" color="primary">
            Accept
          </Button>
          <Button onClick={() => handleRespondAppointment("rejected")} variant="outlined" color="error">
            Reject
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VetHealthcarePage;
