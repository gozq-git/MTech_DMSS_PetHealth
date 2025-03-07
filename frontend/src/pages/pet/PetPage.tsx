import {useContext, useEffect, useState} from "react";
import {Box, Button, Card, CircularProgress, Container, Grid2, IconButton, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PetDetailsPopup from "./PetDetailsPopup.tsx";
import AddPetPopup from "./AddPetPopup.tsx";
import {Pet} from "../../api/types/pet.ts";
import {ApiClientContext} from "../../providers/ApiClientProvider.tsx";
import {SNACKBAR_SEVERITY, SnackbarContext} from "../../providers/SnackbarProvider.tsx";
import VaccinationRecord from "../../api/types/vaccinationRecord.ts";
import {PetCard} from "./PetCard.tsx";
import {PetDetailsPanel} from "./PetDetailsPanel.tsx";

const PetPage = () => {
    const {petApi} = useContext(ApiClientContext);
    const {showSnackbar} = useContext(SnackbarContext);
    const [loading, setLoading] = useState(false);
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [openAddPet, setOpenAddPet] = useState(false);
    const [vaccinationRecords, setVaccinationRecords] = useState<VaccinationRecord[]>([]);
    const [usePetDetailsPanel, setUsePetDetailsPanel] = useState(window.innerWidth >= 960); // for larger screens

    // Update usePetDetailsPanel mode on window resize
    useEffect(() => {
        const handleResize = () => {
            setUsePetDetailsPanel(window.innerWidth >= 960);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleOpenPet = (pet: Pet) => {
        loadVaccinationRecords(pet.id).then();
        setSelectedPet(pet);
    };

    const handleClosePet = () => {
        // Reset selected pet after animation completes
        setTimeout(() => setSelectedPet(null), 300);
    };

    const handleOpenAddPet = () => setOpenAddPet(true);
    const handleCloseAddPet = () => setOpenAddPet(false);

    const handleAddPet = (newPet: Pet) => {
        setPets([...pets, newPet]);
        setOpenAddPet(false);
    };

    const loadPets = async () => {
        try {
            setLoading(true);
            const pets = await petApi.getPets("owner-789012")
            setPets(pets);
        } catch (error) {
            let errorMessage = "Error loading pets";
            if (error instanceof Error) errorMessage = error.message;
            if (
                error &&
                typeof error === 'object' &&
                'response' in error &&
                error.response &&
                typeof error.response === 'object' &&
                'data' in error.response &&
                error.response.data &&
                typeof error.response.data === 'object' &&
                'message' in error.response.data
            ) {
                errorMessage = String(error.response.data.message);
            }
            showSnackbar(errorMessage, SNACKBAR_SEVERITY.ERROR);
        } finally {
            setLoading(false);
        }
    }

    const loadVaccinationRecords = async (petId: string) => {
        try {
            const records = await petApi.getVaccinationRecords(petId);
            setVaccinationRecords(records);
        } catch (error) {
            let errorMessage = "Error loading vaccination records";
            if (error instanceof Error) errorMessage = error.message;
            if (
                error &&
                typeof error === 'object' &&
                'response' in error &&
                error.response &&
                typeof error.response === 'object' &&
                'data' in error.response &&
                error.response.data &&
                typeof error.response.data === 'object' &&
                'message' in error.response.data
            ) {
                errorMessage = String(error.response.data.message);
            }
            showSnackbar(errorMessage, SNACKBAR_SEVERITY.ERROR);
        }
    }

    useEffect(() => {
        loadPets().then(res => {
            console.log(res)
        })
    }, [petApi])

    return (
        <Container maxWidth="lg" >
            <Box sx={{padding: 3}}>
                {/* Header Section */}
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, minWidth: 300}}>
                    <Typography variant="h4" fontWeight="bold">My Pets</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon/>}
                        onClick={handleOpenAddPet}
                        sx={{borderRadius: "20px", textTransform: "none", fontSize: "16px"}}
                    >
                        Add Pet
                    </Button>
                </Box>

                {/* Main Content */}
                <Grid2 container spacing={3}>
                    {/* Pets List - Takes full width when no pet is selected, or left side when a pet is selected */}
                    <Grid2 size={{md: usePetDetailsPanel && selectedPet ? 3 : 12}}>
                        <Box
                            sx={{
                                height: usePetDetailsPanel && selectedPet ? 'calc(100vh - 150px)' : 'auto',
                                overflow: usePetDetailsPanel && selectedPet ? 'auto' : 'visible',
                                pr: 1 // Add a little padding for the scrollbar
                            }}
                        >
                            {loading ? (
                                <CircularProgress/>
                            ) : (
                                <Grid2 container spacing={2}>
                                    {pets.map((pet) => (
                                        <Grid2 size={{
                                            // md: 12,
                                            md: (usePetDetailsPanel && selectedPet) ? 12 : 6,
                                        }} key={pet.id}>
                                            <PetCard pet={pet} selectedPet={selectedPet} handleOpenPet={handleOpenPet}/>
                                        </Grid2>
                                    ))}
                                </Grid2>
                            )}
                        </Box>
                    </Grid2>

                    {/* Pet Details - Right side when a pet is selected in usePetDetailsPanel mode */}
                    {usePetDetailsPanel && selectedPet && (
                        <Grid2 size={{md: 9}}>
                            <Card sx={{borderRadius: 4, overflow: 'hidden'}}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {selectedPet.name}'s Health Records
                                    </Typography>
                                    <IconButton onClick={handleClosePet} size="small">
                                        <CloseIcon/>
                                    </IconButton>
                                </Box>
                                <Box sx={{height: 'calc(100vh - 200px)', overflow: 'auto'}}>
                                    <PetDetailsPanel pet={selectedPet} vaccinationRecords={vaccinationRecords}/>
                                </Box>
                            </Card>
                        </Grid2>
                    )}
                </Grid2>

                {/* Pet Details Dialog - Only used on smaller screens */}
                {!usePetDetailsPanel && selectedPet &&
                    <PetDetailsPopup
                        pet={selectedPet}
                        onClose={handleClosePet}
                    />
                }

                {/* Add Pet Dialog */}
                <AddPetPopup open={openAddPet} onClose={handleCloseAddPet} onAdd={handleAddPet}/>
            </Box>
        </Container>
    );
};

export default PetPage;