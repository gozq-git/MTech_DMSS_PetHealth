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
  Box,
} from "@mui/material";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ApiClientContext } from "../../providers/ApiClientProvider";
import { SnackbarContext, SNACKBAR_SEVERITY } from "../../providers/SnackbarProvider";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: string;
  user_id: string;
  appointment_date: string;
  status: "pending" | "accepted" | "rejected";
}

export const VetHealthcarePage: React.FC = () => {
  const { appointmentsApi, availabilitiesApi, userApi } = useContext(ApiClientContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const navigate = useNavigate();

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

    if (availabilityDates.includes(date)) {
      showSnackbar("This day is already marked as available", SNACKBAR_SEVERITY.INFO);
      return;
    }

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

  const handleJoinCall = (appointmentId: string) => {
    if (appointmentId) {
      navigate(`/teleconsultation?appointmentId=${appointmentId}`);
    } else {
      showSnackbar("Cannot Join Call without Appointment", SNACKBAR_SEVERITY.ERROR);
    }
  };

  const getAppointmentsForCalendar = () => {
    return appointments.map((appointment) => ({
      title: `Appointment with user ${appointment.user_id}`,
      date: appointment.appointment_date,
      backgroundColor: appointment.status === 'accepted' ? '#4caf50' : appointment.status === 'rejected' ? '#f44336' : '#ff9800',
      borderColor: appointment.status === 'accepted' ? '#388e3c' : appointment.status === 'rejected' ? '#d32f2f' : '#f57c00',
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
      backgroundColor: "#a5d6a7",
      borderColor: "#a5d6a7",
      className: "vet-available-day"
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>
          Vet Availability & Appointments
        </Typography>

        <FullCalendar
          key={appointments.length + availabilityDates.length}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable
          dateClick={(info) => setSelectedDate(info.dateStr)}
          events={[...getAppointmentsForCalendar(), ...getAvailabilityEvents()]}
          height="auto"
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => selectedDate && markAvailability(selectedDate)}
            disabled={availabilityLoading || (selectedDate ? availabilityDates.includes(selectedDate) : false)}
          >
            {availabilityLoading ? "Marking..." : "Mark Availability for Selected Date"}
          </Button>
          <Typography variant="body2" color="text.secondary">
            * Available days are highlighted in green on the calendar.
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Appointments on {selectedDate || "select a date"}
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : appointments.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No appointments on this day.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {appointments.map((appointment) => (
              <Paper
                key={appointment.id}
                sx={{
                  p: 2,
                  borderLeft: `6px solid ${appointment.status === "accepted"
                    ? "#4caf50"
                    : appointment.status === "rejected"
                      ? "#f44336"
                      : "#ff9800"
                    }`,
                }}
              >
                <Typography>
                  <strong>User ID:</strong> {appointment.user_id}
                </Typography>
                <Typography>
                  <strong>Status:</strong> {appointment.status}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 1, mr: 1 }}
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setResponseDialogOpen(true);
                  }}
                >
                  Respond
                </Button>

                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => handleJoinCall(appointment.id)}
                >
                  Join Call
                </Button>

              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      <Dialog open={responseDialogOpen} onClose={() => setResponseDialogOpen(false)} fullWidth>
        <DialogTitle>Respond to Appointment</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
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
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button onClick={() => setResponseDialogOpen(false)}>Cancel</Button>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleRespondAppointment("accepted")}
              sx={{ mr: 1 }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRespondAppointment("rejected")}
            >
              Reject
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VetHealthcarePage;
