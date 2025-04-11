import {
    Avatar,
    CircularProgress,
    Container,
    Paper,
    Box,
    Typography,
    Link,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Button
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ApiClientContext } from "../../providers/ApiClientProvider.tsx";
import { useNavigate } from "react-router-dom";
import { SNACKBAR_SEVERITY, SnackbarContext } from "../../providers/SnackbarProvider.tsx";
import { User } from "../../api/types/user.ts";

const HomePageContent = () => {
    const navigate = useNavigate();
    const { userApi } = useContext(ApiClientContext);
    const { showSnackbar } = useContext(SnackbarContext);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [news, setNews] = useState<any[]>([]);
    const [newsLoading, setNewsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const result = await userApi.retrieveUser();
                if (result?.success && result.data) {
                    setUser(result.data);
                } else {
                    setUser(null);
                    showSnackbar(result?.message || "User not found", SNACKBAR_SEVERITY.ERROR);
                    navigate("/profile");
                }
            } catch (err) {
                setError('Failed to load profile data');
                showSnackbar('Failed to load profile data', SNACKBAR_SEVERITY.ERROR);
            } finally {
                setLoading(false);
            }
        };

        const fetchNews = async () => {
            try {
                const response = await fetch(
                    `https://newsapi.org/v2/everything?q=pet%20health%20OR%20veterinary%20medicine%20OR%20animal%20care%20OR%20pet%20care%20OR%20veterinary%20health&sortBy=publishedAt&pageSize=6&apiKey=665c79db2e9944edb41ee8f8433c57d5&language=en`
                );
                const data = await response.json();
                if (data.articles) {
                    setNews(data.articles);
                }
            } catch (err) {
                console.error('Error fetching news:', err);
            } finally {
                setNewsLoading(false);
            }
        };

        // Fetch data
        fetchUserProfile();
        fetchNews();
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 3 }}>
                {/* 👤 Clean Profile Card */}
                <Paper elevation={3} sx={{ p: 0, borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                    <Box
                        sx={{
                            background: 'linear-gradient(to right, #81C784, #66BB6A)', // Green gradient for header
                            height: 120,
                        }}
                    >
                        <Avatar
                            src={user?.profile_picture}
                            alt={user?.display_name || 'User'}
                            sx={{
                                width: 100,
                                height: 100,
                                border: '4px solid white',
                                position: 'absolute',
                                bottom: -50,
                                left: 24,
                                boxShadow: 3,
                                backgroundColor: '#fff',
                            }}
                        />
                    </Box>
                    <Box sx={{ pt: 7, pb: 3, px: 3 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            🐾 Welcome back, {user?.display_name || 'Pet Lover'}!
                        </Typography>
                        {user?.email && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                📧 {user.email}
                            </Typography>
                        )}
                        {user?.bio && (
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                {user.bio}
                            </Typography>
                        )}
                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                    </Box>
                </Paper>

                {/* 💡 Pet Tip of the Day */}
                <Paper
                    elevation={1}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: '#f0f4f8',
                        borderLeft: '5px solid #66BB6A', // Green accent color
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        🐾 Keep your pet hydrated and make sure they have access to fresh water all day long!
                    </Typography>
                </Paper>

                {/* 📰 News Section (Clean + Modern) */}
                <Paper elevation={1} sx={{ p: 3, borderRadius: 3, backgroundColor: '#fdfdfd' }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        🐶 Latest Veterinary & Pet Health News
                    </Typography>

                    {newsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : news.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No recent news available.
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {news.map((article, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.03)',
                                                boxShadow: 6,
                                            },
                                            borderRadius: 2,
                                            backgroundColor: '#ffffff',
                                        }}
                                        variant="outlined"
                                    >
                                        {article.urlToImage && (
                                            <CardMedia
                                                component="img"
                                                height="160"
                                                image={article.urlToImage}
                                                alt={article.title}
                                            />
                                        )}
                                        <CardContent>
                                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom noWrap>
                                                {article.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                                                {article.description || 'No summary available.'}
                                            </Typography>
                                            <Link
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                underline="hover"
                                            >
                                                Read more →
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default HomePageContent;
