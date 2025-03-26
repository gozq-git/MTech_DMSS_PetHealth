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
import {MedicationRecord} from "../../api/types/medicationRecord.ts";

const PetPage = () => {
    const {petApi} = useContext(ApiClientContext);
    const {userApi} = useContext(ApiClientContext);
    const {showSnackbar} = useContext(SnackbarContext);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [openAddPet, setOpenAddPet] = useState(false);
    const [vaccinationRecords, setVaccinationRecords] = useState<VaccinationRecord[]>([]);
    const [medicationRecords, setMedicationRecords] = useState<MedicationRecord[]>([]);
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
        // loadMedicationRecords(pet.id).then();
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
            const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API
            if (USE_MOCK_API === false) {
                const petsApiResponse = await petApi.getPetsByOwnerId("owner-789012")
                if (petsApiResponse.data) {
                    const pets = petsApiResponse.data as Pet[];
                    setPets(pets)
                }
            } else {
                const user = await userApi.retrieveUser()
                const ownerId = user.data?.id
                console.info("ownerId:", ownerId) // 1f005b07-46cb-6670-85cc-854ff2948567
                if (ownerId) {
                    const petsApiResponse = await petApi.getPetsByOwnerId(ownerId)
                    if (petsApiResponse.data) {
                        const pets = petsApiResponse.data as Pet[];
                        setPets(pets)
                    }
                    // console.log(petsApiResponse)
                }
            }
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
            const response = await petApi.getVaccinationRecords(petId);
            if(response.success) {
                const vaccinationRecords = response.data as VaccinationRecord[];
                if(vaccinationRecords.length > 0) {
                    setVaccinationRecords(vaccinationRecords);
                }
            } else {
                showSnackbar(response.message, SNACKBAR_SEVERITY.ERROR)
            }
            // console.log(`loadVaccinationRecords:`,response);
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

    const loadMedicationRecords = async (petId: string) => {
        try {
            const records = await petApi.getMedicationRecords(petId);
            setMedicationRecords(records);
        } catch (error) {
            let errorMessage = "Error loading Medication records";
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

    const handleRecordAdded = () => {
        if (selectedPet) {
            loadVaccinationRecords(selectedPet.id).then();
            // loadMedicationRecords(selectedPet.id).then();
        }
    }

    useEffect(() => {
        loadPets()
    }, [petApi])

    return (
        <Container
            maxWidth={false}
            sx={{
                paddingTop: 8,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                overflow: 'hidden', // The outer container doesn't scroll
                bgcolor: 'background.default',
                zIndex: 1000,
            }}>

            <Container
                sx={{
                    // py: 2,
                    // px: 3,
                    border: "2px solid pink",
                    borderRadius: "8px",
                    height: '100%', // Take full height of parent
                    display: 'flex',
                    flexDirection: 'column',
                    // my: 2,
                    // mx: 2
                }}
            >
                {/* Header Section */}
                <Box
                    sx={{
                        paddingTop: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                        minWidth: 300,
                    }}>
                    <Typography variant="h4" fontWeight="bold">My Pets</Typography>
                    {error && <Typography color="error" sx={{mt: 2}}>
                        {error.message}
                    </Typography>}
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
                <Box
                    sx={{
                        // overflow: 'auto', // This enables scrolling for this inner box
                        padding: 1, // Add some padding if needed
                        maxHeight: '90vh',
                    }}
                >
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
                                                md: (usePetDetailsPanel && selectedPet) ? 12 : 3,
                                            }} key={pet.id}>
                                                <PetCard pet={pet} selectedPet={selectedPet}
                                                         handleOpenPet={handleOpenPet}/>
                                            </Grid2>
                                        ))}
                                    </Grid2>
                                )}
                            </Box>
                        </Grid2>

                        {/* Pet Details - Right side when a pet is selected in usePetDetailsPanel mode */}
                        {usePetDetailsPanel && selectedPet && (
                            <Grid2 size={{md: 9}} sx={{height: '100%'}}>
                                <Card sx={{
                                    borderRadius: 4,
                                    // overflow: 'hidden',
                                    height: '100%',
                                    display: 'flex,',
                                    flexDirection: 'column',
                                    // backgroundColor: 'orange'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 2,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        // backgroundColor: 'pink'
                                    }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            {selectedPet.name}'s Health Records
                                        </Typography>
                                        <IconButton onClick={handleClosePet} size="small">
                                            <CloseIcon/>
                                        </IconButton>
                                    </Box>
                                    <PetDetailsPanel
                                        pet={selectedPet}
                                        vaccinationRecords={vaccinationRecords}
                                        medicationRecords={medicationRecords}
                                        onRecordAdded={handleRecordAdded}
                                    />
                                </Card>
                            </Grid2>
                        )}
                    </Grid2>
                </Box>
                {/* Pet Details Dialog - Only used on smaller screens */}
                {!usePetDetailsPanel && selectedPet &&
                    <PetDetailsPopup
                        pet={selectedPet}
                        onClose={handleClosePet}
                    />
                }

                {/* Add Pet Dialog */}
                <AddPetPopup open={openAddPet} onClose={handleCloseAddPet} onAdd={handleAddPet}/>
            </Container>
        </Container>
    );
};

export default PetPage;