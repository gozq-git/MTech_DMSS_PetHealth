import {Avatar, CircularProgress, Container, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useContext, useEffect, useState} from "react";
import {ApiClientContext} from "../../providers/ApiClientProvider.tsx";
import {useNavigate} from "react-router-dom";
import {SNACKBAR_SEVERITY, SnackbarContext} from "../../providers/SnackbarProvider.tsx";
import {User} from "../../api/types/user.ts";

const HomePageContent = () => {
    const navigate = useNavigate();
    const { userApi } = useContext(ApiClientContext);
    const {showSnackbar} = useContext(SnackbarContext);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const result = await userApi.retrieveUser();
                if(result != null) {
                    if (result.success && result.data) {
                        setUser(result.data);
                    } else {
                        setUser(null);
                        // Show the error message in your snackbar
                        showSnackbar(result.message, SNACKBAR_SEVERITY.ERROR);
                        navigate("/profile");
                    }
                } else {
                    setUser(null);
                    showSnackbar("User not found", SNACKBAR_SEVERITY.ERROR);
                }

            } catch (err) {
                setError('Failed to load profile data');
                showSnackbar('Failed to load profile data', SNACKBAR_SEVERITY.ERROR);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);


    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={user?.profile_picture}
                            alt={user?.display_name || 'User'}
                            sx={{ width: 128, height: 128, mr: 2 }}
                        />
                        <Box sx={{textAlign: 'left' }}>
                            <Typography variant="h5" component="div">
                                Welcome back, {user?.display_name || 'User'}
                            </Typography>
                            {user?.email && (
                                <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                </Typography>
                            )}
                            {user?.bio && (
                                <Typography variant="body1" sx={{ mt: 2 }}>
                                    {user.bio}
                                </Typography>
                            )}
                            {error && (
                                <Typography color="error" sx={{ mt: 2 }}>
                                    {error}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Paper>

                {/* Additional content sections can go here */}
            </Box>
        </Container>
    );
}

export default HomePageContent;