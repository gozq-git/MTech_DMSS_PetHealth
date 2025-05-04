// FeesPage.tsx
import React, {useContext, useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@mui/material';
import {ApiClientContext} from '../../providers/ApiClientProvider';
import {SNACKBAR_SEVERITY, SnackbarContext} from '../../providers/SnackbarProvider';
import {PaymentComponent} from "./PaymentComponent.tsx";

interface FeesPageProps {
    open: boolean;
    onClose: () => void;
}

export const FeesPage: React.FC<FeesPageProps> = ({open, onClose}) => {
    const {feesApi} = useContext(ApiClientContext);
    const {showSnackbar} = useContext(SnackbarContext);
    const [feeDetails, setFeeDetails] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);

    useEffect(() => {
        if (open) {
            setLoading(true);
            setShowPayment(false);
            setPaymentComplete(false);

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

    const handleMakePayment = () => {
        setShowPayment(true);
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setPaymentComplete(true);
        showSnackbar('Payment successful', SNACKBAR_SEVERITY.SUCCESS);
    };

    const handlePaymentError = (message: string) => {
        showSnackbar(message, SNACKBAR_SEVERITY.ERROR);
    };

    const handlePaymentCancel = () => {
        setShowPayment(false);
    };

    const renderDialogContent = () => {
        if (loading) {
            return <CircularProgress/>;
        }

        if (!feeDetails) {
            return <Typography>No fee details available.</Typography>;
        }

        if (showPayment) {
            return (
                <PaymentComponent
                    paymentDetails={{
                        amount: feeDetails.total,
                        currency: 'sgd',
                        description: `Veterinary consultation on ${feeDetails.date}`
                    }}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onCancel={handlePaymentCancel}
                />
            );
        }

        if (paymentComplete) {
            return (
                <Box sx={{textAlign: 'center', py: 2}}>
                    <Typography variant="h6" gutterBottom>Payment Complete!</Typography>
                    <Typography>
                        Thank you for your payment. A receipt has been sent to your email.
                    </Typography>
                </Box>
            );
        }

        return (
            <>
                <Typography><strong>Date:</strong> {feeDetails.date}</Typography>
                <Typography><strong>Time:</strong> {feeDetails.time}</Typography>
                <Typography><strong>Base Fee:</strong> ${feeDetails.baseFee}</Typography>
                <Typography><strong>Time Fee:</strong> ${feeDetails.timeFee}</Typography>
                <Typography sx={{mt: 1}}><strong>Total:</strong> ${feeDetails.total}</Typography>
            </>
        );
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Consultation Fee</DialogTitle>
            <DialogContent dividers>
                {renderDialogContent()}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                {!showPayment && !paymentComplete && feeDetails && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleMakePayment}
                    >
                        Make Payment
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
