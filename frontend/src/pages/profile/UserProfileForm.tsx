import {
    Button,
    CircularProgress,
    Container,
    Paper,
    Stack,
    TextField,
    Typography,
    Divider,
  } from "@mui/material";
  import Box from "@mui/material/Box";
  import React, { useContext, useEffect, useState } from "react";
  import { SNACKBAR_SEVERITY, SnackbarContext } from "../../providers/SnackbarProvider.tsx";
  import { ApiClientContext } from "../../providers/ApiClientProvider.tsx";
  import { msalInstance } from "../../main.tsx";
  import { useNavigate } from "react-router-dom"; 
  
  interface UserProfileFormItem {
    id: string;
    label: string;
    type?: string;
  }
  
  interface UserProfileFormValues {
    account_name: string;
    display_name: string;
    email: string;
    bio: string;
    profile_picture: string;
  }
  
  const userProfileFormItems: UserProfileFormItem[] = [
    { id: "account_name", label: "Account Name", type: "text" },
    { id: "display_name", label: "Display Name", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "bio", label: "Bio", type: "text" },
    { id: "profile_picture", label: "Profile Picture URL", type: "text" },
  ];
  
  export const UserProfileForm = () => {
    const { showSnackbar } = useContext(SnackbarContext);
    const { userApi } = useContext(ApiClientContext);
    const navigate = useNavigate(); 
  
    const [formValues, setFormValues] = useState<UserProfileFormValues>({
      account_name: '',
      display_name: '',
      email: '',
      bio: '',
      profile_picture: '',
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const result = await userApi.retrieveUser();
  
          if (result && result.success && result.data) {
            setFormValues({
              account_name: result.data.account_name || '',
              display_name: result.data.display_name || '',
              email: result.data.email || '',
              bio: result.data.bio || '',
              profile_picture: result.data.profile_picture || '',
            });
            setIsUpdate(true);
          } else {
            const activeAccount = msalInstance && msalInstance.getActiveAccount();
            if (activeAccount && activeAccount.username) {
              setFormValues(prev => ({
                ...prev,
                email: activeAccount.username,
                display_name: activeAccount.name || activeAccount.username.split('@')[0] || '',
              }));
            }
            setIsUpdate(false);
            showSnackbar("Please create your profile", SNACKBAR_SEVERITY.INFO);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          showSnackbar("Failed to load profile data", SNACKBAR_SEVERITY.ERROR);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, []);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };
  
    const submitForm = async () => {
      try {
        const userData = { ...formValues };
  
        if (isUpdate) {
          const result = await userApi.updateUser(userData);
          if (result.success) {
            showSnackbar("Profile updated successfully!", SNACKBAR_SEVERITY.SUCCESS);
          } else {
            showSnackbar(result.message, SNACKBAR_SEVERITY.ERROR);
          }
        } else {
          const result = await userApi.registerUser(userData);
          if (result.success) {
            showSnackbar("Profile created successfully!", SNACKBAR_SEVERITY.SUCCESS);
            setIsUpdate(true);
            navigate("/home"); 
          } else {
            showSnackbar(result.message, SNACKBAR_SEVERITY.ERROR);
          }
        }
      } catch (error) {
        console.error(`Failed to ${isUpdate ? 'update' : 'create'} profile:`, error);
        showSnackbar(`Failed to ${isUpdate ? 'update' : 'create'} profile. Please try again.`, SNACKBAR_SEVERITY.ERROR);
      }
    };
  
    if (loading) {
      return (
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 4, mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress />
          </Paper>
        </Container>
      );
    }
  
    return (
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            {isUpdate ? 'Update Profile' : 'Create Profile'}
          </Typography>
          <Typography variant="body1" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
            {isUpdate
              ? 'Update your profile information below'
              : 'Please fill in your personal information below to create your profile'}
          </Typography>
  
          <Divider sx={{ mb: 4 }} />
  
          <Stack spacing={3}>
            {userProfileFormItems.map((item) => (
              <TextField
                key={item.id}
                id={item.id}
                name={item.id}
                label={item.label}
                variant="outlined"
                fullWidth
                type={item.type || "text"}
                value={formValues[item.id as keyof UserProfileFormValues]}
                onChange={handleChange}
                disabled={item.id === "email"}
              />
            ))}
  
            <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 4 }} />
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" onClick={submitForm} sx={{ px: 4 }}>
                  {isUpdate ? 'Update' : 'Create'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    );
  };
  