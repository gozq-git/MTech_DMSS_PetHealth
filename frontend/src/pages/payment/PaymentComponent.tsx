// src/payment/PaymentComponent.tsx
import React, {useEffect, useState, useContext} from 'react';
import {
    Box, Typography, Button, CircularProgress, Paper
} from '@mui/material';
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {ApiClientContext} from "../../providers/ApiClientProvider.tsx";
// import {SnackbarContext} from "../../providers/SnackbarProvider.tsx";


// Load Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentDetails {
    amount: number;
    currency: string;
    description: string;
}

interface PaymentComponentProps {
    paymentDetails: PaymentDetails;
    onSuccess: () => void;
    onError: (message: string) => void;
    onCancel: () => void;
}

// Stripe payment form
const StripePaymentForm = ({
                               paymentDetails,
                               onSuccess,
                               onError,
                               onCancel
                           }: PaymentComponentProps) => {
    // const {showSnackbar} = useContext(SnackbarContext);
    const {paymentApi} = useContext(ApiClientContext);
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [paymentId, setPaymentId] = useState<string | null>(null);

    useEffect(() => {
        // Create a payment when the form loads
        const createPayment = async () => {
            setLoading(true);
            try {
                const result = await paymentApi.createPayment({
                    amount: Math.round(paymentDetails.amount * 100), // Convert to cents
                    currency: paymentDetails.currency,
                    description: paymentDetails.description,
                    paymentType: 'stripe'
                });

                if (result.success && result.data?.paymentId) {
                    setPaymentId(result.data.paymentId);
                } else {
                    onError(result.error?.message || 'Failed to initialize payment');
                }
            } catch (error) {
                onError('Payment initialization failed');
            } finally {
                setLoading(false);
            }
        };

        if (paymentDetails) {
            createPayment();
        }
    }, [paymentDetails]);

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (!stripe || !elements || !paymentId) {
            return;
        }

        setLoading(true);

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            // Create payment method
            const {error, paymentMethod} = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });
            console.info('Payment method:', paymentMethod);

            if (error) {
                throw new Error(error.message);
            }

            // Capture the payment
            const captureResult = await paymentApi.capturePayment({
                paymentId
            });

            if (!captureResult.success) {
                throw new Error(captureResult.error?.message || 'Payment capture failed');
            }

            // Check final status
            const statusResult = await paymentApi.getPaymentStatus(paymentId);

            if (statusResult.success && statusResult.data?.status === 'captured') {
                onSuccess();
            } else {
                throw new Error('Payment was not completed successfully');
            }
        } catch (error) {
            onError(error instanceof Error ? error.message : 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={2} sx={{p: 3, maxWidth: 500, mx: 'auto'}}>
            <Typography variant="h6" gutterBottom>
                Payment Details
            </Typography>
            <Box sx={{mb: 2}}>
                <Typography><strong>Amount:</strong> ${paymentDetails.amount.toFixed(2)}</Typography>
                <Typography><strong>Description:</strong> {paymentDetails.description}</Typography>
            </Box>

            <form onSubmit={handleSubmit}>
                <Box sx={{my: 3}}>
                    <Typography variant="subtitle2" gutterBottom>
                        Card Details
                    </Typography>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 3}}>
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!stripe || loading || !paymentId}
                    >
                        {loading ? <CircularProgress size={24}/> : `Pay $${paymentDetails.amount.toFixed(2)}`}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

// Main export component with Stripe Elements provider
export const PaymentComponent: React.FC<PaymentComponentProps> = (props) => {
    return (
        <Elements stripe={stripePromise}>
            <StripePaymentForm {...props} />
        </Elements>
    );
};