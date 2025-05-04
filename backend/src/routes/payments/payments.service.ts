import { sequelize, Sequelize } from "../../db/index"; // Import the Sequelize instance

const Models = sequelize.models;

const PaymentsService = {
    createPayment: async (userId: string, amount: number, currency: string, paymentId: string) => {
        try {
            // Store payment details in the database
            const paymentRecord = await Models.PAYMENTS.create({
                user_id: userId || '1f010b3d-e2b5-6ea0-a416-e5e84a17696f',
                payment_system: "stripe", // Assuming Stripe as the default system
                payment_id: paymentId,
                amount,
                currency,
                status: "created",
            });

            return paymentRecord;
        } catch (error: any) {
            throw new Error(`Failed to create payment: ${error.message}`);
        }
    },

    capturePayment: async (paymentId: string) => {
        try {

            // Update payment status in the database
            await Models.PAYMENTS.update(
                { status: "captured" },
                { where: { payment_id: paymentId } }
            );

            return;

        } catch (error: any) {
            throw new Error(`Failed to capture payment: ${error.message}`);
        }
    },

    checkPaymentStatus: async (paymentId: string) => {
        try {

            // Update payment status in the database
            const status = await Models.PAYMENTS.findOne(
                { where: { payment_id: paymentId } }
            );

            return status;
        } catch (error: any) {
            throw new Error(`Failed to check payment status: ${error.message}`);
        }
    },
};

export default PaymentsService;

