import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Grid,
    Grid2,
    Link,
    Paper,
    Typography
} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {ApiClientContext} from "../../providers/ApiClientProvider.tsx";
import {useNavigate} from "react-router-dom";
import {SNACKBAR_SEVERITY, SnackbarContext} from "../../providers/SnackbarProvider.tsx";
import {User} from "../../api/types/user.ts";

const HomePageContent = () => {
    const navigate = useNavigate();
    const {userApi} = useContext(ApiClientContext);
    const {showSnackbar} = useContext(SnackbarContext);
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
        // Fetch data
        fetchUserProfile();
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(
                    `https://newsapi.org/v2/everything?q=pets+vets&language=en&pageSize=9&sortBy=relevancy&apiKey=665c79db2e9944edb41ee8f8433c57d5`
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
        fetchNews();
    }, [])

    if (loading) {
        return (
            <Container>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px'}}>
                    <CircularProgress/>
                </Box>
            </Container>
        );
    }
    ;

    const sanitizeUrl = (url: string): boolean => {
        try {
            const parsedUrl = new URL(url, window.location.origin);
            if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
                return true;
            }
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    return (
        <Container sx={{
            width: '80vw',

        }}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 3, py: 3}}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        overflow: 'hidden',
                        position: 'relative',
                        background: 'linear-gradient(135deg, #e0f2f1 0%, #80cbc4 50%, #00897b 100%)',
                    }}
                >
                    {/* Background decoration */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '150px',
                            height: '150px',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
                            zIndex: 0,
                        }}
                    />

                    <Grid2 container spacing={3} justifyContent="center" alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                        <Grid2 size={{md: 12}} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Avatar
                                src={user?.profile_picture}
                                alt={user?.display_name || 'User'}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: '5px solid white',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    backgroundColor: '#fff',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    }
                                }}
                            />
                        </Grid2>

                        <Grid2 size={{md: 12}} sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                gutterBottom
                                sx={{
                                    color: '#1a237e',
                                    textShadow: '0 1px 1px rgba(255,255,255,0.7)'
                                }}
                            >
                                🐾 Welcome back, {user?.display_name || 'Pet Lover'}!
                            </Typography>
                        </Grid2>

                        {user?.email && (
                            <Grid2 size={{md: 12}} sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.6)',
                                        py: 0.5,
                                        px: 2,
                                        borderRadius: 5,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    📧 {user.email}
                                </Typography>
                            </Grid2>
                        )}

                        {user?.bio && (
                            <Grid2 size={{md: 12}} sx={{ textAlign: 'center', mt: 1 }}>
                                <Box
                                    sx={{
                                        backgroundColor: 'rgba(255,255,255,0.6)',
                                        p: 2,
                                        borderRadius: 2,
                                        maxWidth: '80%',
                                        mx: 'auto',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Typography variant="body1">
                                        {user.bio}
                                    </Typography>
                                </Box>
                            </Grid2>
                        )}

                        {error && (
                            <Grid2 size={{md: 12}} sx={{ textAlign: 'center' }}>
                                <Alert severity="error" sx={{ mt: 2, display: 'inline-flex', maxWidth: '80%' }}>
                                    {error}
                                </Alert>
                            </Grid2>
                        )}
                    </Grid2>
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
                <Paper elevation={1} sx={{p: 3, borderRadius: 3, backgroundColor: '#fdfdfd'}}>
                    <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        🐶 Latest Veterinary & Pet Health News
                    </Typography>

                    {newsLoading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                            <CircularProgress/>
                        </Box>
                    ) : news.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No recent news available.
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {news.map((article: any, index: any) => (
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
                                            <Typography variant="body2" color="text.secondary" sx={{mb: 1}} noWrap>
                                                {article.description || 'No summary available.'}
                                            </Typography>
                                            {sanitizeUrl(article.url) &&
                                                <Link
                                                    href={article.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    underline="hover"
                                                >
                                                    Read more →
                                                </Link>
                                            }
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
