import {useState} from "react";
import {createContext} from "react";
import {Alert, Snackbar} from "@mui/material";

interface SnackbarContextType {
    showSnackbar: (message: string, severity?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const SnackbarContext = createContext<SnackbarContextType>({
    showSnackbar: () => {}
});

// Snackbar Provider
export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{showSnackbar}}>
            {children}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};