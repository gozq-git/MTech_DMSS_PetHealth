import { Box, Typography, Avatar, Container, Paper, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { styled } from '@mui/system';

const BackgroundBox = styled(Box)(() => ({
  backgroundColor: "white", 
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
}));

const FeatureCard = styled(Paper)(() => ({
  background: "rgba(255, 255, 255, 0.9)", 
  borderRadius: "12px",
  padding: "24px",
  textAlign: "center",
  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  height: "200px", 
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.2)",
  },
}));

const HeroText = styled(Typography)(() => ({
  color: "#333", 
  fontWeight: 700,
  fontSize: "2.5rem",
  textAlign: "center",
  marginBottom: "20px",
}));

const FeatureHeading = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: "2rem",
  textAlign: "center",
  marginBottom: "30px",
}));

const SectionDivider = styled(Box)(() => ({
  width: "80%",
  height: "2px",
  backgroundColor: "#ddd",
  margin: "40px auto",
}));

const AvatarStyled = styled(Avatar)(() => ({
  width: "100px",
  height: "100px",
  margin: "0 auto",
  border: "4px solid #fff",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
}));

const features = [
  { title: "Health Records", description: "Keep detailed records of your pet’s health, including vaccinations, surgeries, and medical history." },
  { title: "Make Appointment", description: "Schedule appointments with trusted veterinarians, ensuring your pet's well-being." },
  { title: "Pet Profiles", description: "Create comprehensive profiles for your pets, including their medical records and health tracking." },
  { title: "Schedule Appointment", description: "As a Pet Owner, book appointments with Vets or pet centers. Filter by location, services, and timing." },
  { title: "Virtual Teleconsultation", description: "As a Pet Owner, join a video call for virtual appointments with Vets." },
  { title: "Health Record Endorsement", description: "As a Vet, endorse health records for validation and follow-up treatment." }
];

const teamMembers = [
  { name: "Swati", role: "Chief Executive Officer", initials: "SW" },
  { name: "Gerard", role: "DevSecOps Engineer", initials: "G" },
  { name: "Yang", role: "Frontend Engineer", initials: "Y" },
  { name: "Yi Rong", role: "Backend Engineer", initials: "YR" },
  { name: "Venkat", role: "Backend Engineer", initials: "V" }
];

const LandingPage = () => {
  return (
    <BackgroundBox>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <HeroText variant="h3">Welcome to Pet Health Platform!</HeroText>
        <Typography variant="h6" sx={{ color: "#333", textAlign: "center", mb: 3 }}>
          Track and manage your pet's health records, book teleconsultations, and much more.
        </Typography>
      </motion.div>

      <SectionDivider />

      <FeatureHeading variant="h4">Platform Features</FeatureHeading>
      
      <Container>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid key={index} item xs={12} md={6}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <FeatureCard>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.2rem" }}>{feature.title}</Typography>
                  <Typography variant="body2" sx={{ mt: 2, fontSize: "0.9rem" }}>{feature.description}</Typography>
                </FeatureCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      <SectionDivider />

      <FeatureHeading variant="h4">Meet The Team</FeatureHeading>
      <Container>
        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <AvatarStyled>{member.initials}</AvatarStyled>
              <Typography variant="h6" sx={{ mt: 2 }}>{member.name}</Typography>
              <Typography variant="body2">{member.role}</Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      <SectionDivider />
    </BackgroundBox>
  );
};

export default LandingPage;

