import {
    Container,
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Avatar,
    Button,
  } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
  
  const VetHomePage = () => {
    const navigate = useNavigate();
  
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, py: 4 }}>
          {/* 👨‍⚕️ Vet Profile Summary */}
          <Paper elevation={3} sx={{ p: 0, borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
            <Box
              sx={{
                background: 'linear-gradient(to right, #81C784, #66BB6A)',
                height: 120,
              }}
            />
            <Avatar
              src="/vet-avatar.png"
              alt="Veterinarian"
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
            <Box sx={{ pt: 7, pb: 3, px: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                👋 Welcome back, Doctor!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Here's a quick snapshot of your day.
              </Typography>
            </Box>
          </Paper>
  
          {/* 📆 Quick Actions */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderLeft: '5px solid #66BB6A',
                  backgroundColor: '#f7fdf9',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Today's Consultations
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    View and manage your upcoming appointments.
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate('/consultations')}
                  >
                    Go to Consultations
                  </Button>
                </CardContent>
              </Card>
            </Grid>
  
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderLeft: '5px solid #66BB6A',
                  backgroundColor: '#f0f4f8',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Patient Records
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Access pet medical histories and notes.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => navigate('/records')}
                  >
                    View Records
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  };
  
  export default VetHomePage;
  