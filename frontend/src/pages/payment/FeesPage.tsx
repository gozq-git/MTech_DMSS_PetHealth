// FeesPage.tsx
import React, { useEffect, useState, useContext } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, CircularProgress
} from '@mui/material';
import { ApiClientContext } from '../../providers/ApiClientProvider';
import { SnackbarContext, SNACKBAR_SEVERITY } from '../../providers/SnackbarProvider';

interface FeesPageProps {
  open: boolean;
  onClose: () => void;
}

export const FeesPage: React.FC<FeesPageProps> = ({ open, onClose }) => {
  const { feesApi } = useContext(ApiClientContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [feeDetails, setFeeDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      feesApi.getConsultationFee()
        .then((response) => {
          if (response.status === 'success' && response.data) {
            setFeeDetails(response.data);
          } else {
            showSnackbar(response.message || 'Failed to fetch fee details', SNACKBAR_SEVERITY.ERROR);
          }
        })
        .catch(() => showSnackbar('Error fetching fees', SNACKBAR_SEVERITY.ERROR))
        .finally(() => setLoading(false));
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Consultation Fee</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : feeDetails ? (
          <>
            <Typography><strong>Date:</strong> {feeDetails.date}</Typography>
            <Typography><strong>Time:</strong> {feeDetails.time}</Typography>
            <Typography><strong>Base Fee:</strong> ${feeDetails.baseFee}</Typography>
            <Typography><strong>Time Fee:</strong> ${feeDetails.timeFee}</Typography>
            <Typography sx={{ mt: 1 }}><strong>Total:</strong> ${feeDetails.total}</Typography>
          </>
        ) : (
          <Typography>No fee details available.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" color="primary">Make Payment</Button>
      </DialogActions>
    </Dialog>
  );
};
