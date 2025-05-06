import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {FormControlLabel, FormGroup, Switch} from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

interface NotificationSettingsModalProps {
    open: boolean;
    handleClose: () => void;
    handleOpen: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({open,handleClose}) => {

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Notification Settings
                </Typography>
                <FormGroup>
                    <FormControlLabel control={<Switch defaultChecked />} label="Email" />
                    <FormControlLabel control={<Switch defaultChecked />} label="Push Notifications" />
                </FormGroup>
            </Box>
        </Modal>

    );
}
