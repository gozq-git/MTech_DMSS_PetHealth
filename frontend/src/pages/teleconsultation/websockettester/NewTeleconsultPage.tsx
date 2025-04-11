import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { ConsultationRoomManager } from "./ConsultationRoomManager.tsx";
import { ApiClientContext } from "../../../providers/ApiClientProvider.tsx";
import { SNACKBAR_SEVERITY, SnackbarContext } from "../../../providers/SnackbarProvider.tsx";
import { useLocation } from "react-router-dom"; // To get query params from URL

export const NewTeleconsultPage: React.FC = () => {
  const { userApi } = useContext(ApiClientContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<null | "vet" | "pet-owner">(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null); // New state for appointmentId

  const location = useLocation(); // Using useLocation to access URL query params

  // Extracting the appointmentId from the URL query string
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const appointmentIdFromUrl = urlParams.get("appointmentId");
    setAppointmentId(appointmentIdFromUrl); // Set the appointmentId if available
  }, [location]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const result = await userApi.retrieveUser();
        if (result != null) {
          if (result.success && result.data) {
            const role = result.data.VET ? "vet" : "pet-owner";
            setUserRole(role);
            setUserId(result.data.id);
          } else {
            // handle user fetching failure
          }
        } else {
          // handle API failure
        }
      } catch (err) {
        showSnackbar("Failed to load profile data", SNACKBAR_SEVERITY.ERROR);
      }
    };
    fetchUserProfile();
  }, [userApi, showSnackbar]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Vet Teleconsultation Service
          </Typography>
        </Box>
        {userId && userRole ? (
          // Pass the appointmentId to the ConsultationRoomManager
          <ConsultationRoomManager
            userId={userId}
            userRole={userRole}
            appointmentId={appointmentId} // Pass appointmentId as a prop
          />
        ) : (
          <Typography variant="body2" component="p">
            userId && userRole not loaded
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default NewTeleconsultPage;
