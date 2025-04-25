import React, { useState, useEffect, useContext } from 'react';
import { Paper, Typography, CircularProgress, Button } from '@mui/material';
import { ApiClientContext } from '../../providers/ApiClientProvider';
import { SnackbarContext, SNACKBAR_SEVERITY } from '../../providers/SnackbarProvider';

export const FeesPage: React.FC = () => {
  const { feesApi } = useContext(ApiClientContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const [feeDetails, setFeeDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const response = await feesApi.getConsultationFee();
      if (response.success) {
        setFeeDetails(response.data);
      } else {
        showSnackbar(response.message, SNACKBAR_SEVERITY.ERROR);
      }
    } catch (error) {
      console.error("Error fetching fees:", error);
      showSnackbar("Error fetching fees", SNACKBAR_SEVERITY.ERROR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: '#ffffff', mt: 6 }}>
      <Typography variant="h5" gutterBottom fontWeight={600} color="primary.main">
        Consultation Fee Details
      </Typography>

      {loading ? (
        <CircularProgress sx={{ mt: 3 }} />
      ) : feeDetails ? (
        <>
          <Typography variant="body1">
            <strong>Date:</strong> {feeDetails.date}
          </Typography>
          <Typography variant="body1">
            <strong>Time:</strong> {feeDetails.time}
          </Typography>
          <Typography variant="body1">
            <strong>Base Fee:</strong> ${feeDetails.baseFee}
          </Typography>
          <Typography variant="body1">
            <strong>Time Fee:</strong> ${feeDetails.timeFee}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Total Fee:</strong> ${feeDetails.total}
          </Typography>
        </>
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
          No fee details available.
        </Typography>
      )}

      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={fetchFees}>
        Refresh Fees
      </Button>
    </Paper>
  );
};

export default FeesPage;
