import {useState} from "react";
import {
    Card, CardContent, Typography, Button, Avatar, Box
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PetDetailsPopup from "./PetDetailsPopup.tsx";
import AddPetPopup from "./AddPetPopup.tsx";
import {Pet} from "../../api/types/pet.ts";


// Sample pets
const petsData: Pet[] = [
{
    id: "pet-123456",
    ownerId: "owner-789012",
    name: "Max",
    gender: "male",
    species: "dog",
    breed: "Golden Retriever",
    dateOfBirth: "2020-05-15",
    weight: 32.5,
    height: 58,
    neckGirthCm: 42,
    chestGirthCm: 75,
    lastMeasured: "2024-02-10T14:30:00Z",
    isNeutered: true,
    microchipNumber: "985121054367890",
    photoUrl: "https://example.com/pets/max.jpg",
    createdAt: "2020-06-01T10:15:30Z",
    updatedAt: "2024-02-10T14:35:22Z",
    isDeleted: false
}
]

const PetPage = () => {
    const [pets, setPets] = useState<Pet[]>(petsData);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [openAddPet, setOpenAddPet] = useState(false);

    const handleOpenPet = (pet: Pet) => setSelectedPet(pet);
    const handleClosePet = () => setSelectedPet(null);
    const handleOpenAddPet = () => setOpenAddPet(true);
    const handleCloseAddPet = () => setOpenAddPet(false);

    const handleAddPet = (newPet: Pet) => {
        setPets([...pets,newPet]);
        setOpenAddPet(false);
    };

    return (
        <Box sx={{padding: 3}}>
            {/* Header Section */}
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
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

            {/* Pets List */}
            <Box sx={{display: "flex", gap: 3, flexWrap: "wrap"}}>
                {pets.map((pet) => (
                    <Card
                        key={pet.id}
                        sx={{
                            width: 320,
                            padding: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            borderRadius: 4,
                            boxShadow: 3,
                            cursor: "pointer",
                            transition: "0.3s",
                            "&:hover": {boxShadow: 6}
                        }}
                        onClick={() => handleOpenPet(pet)}
                    >
                        {/* Circular Avatar */}
                        <Avatar
                            src={pet.photoUrl}
                            alt={pet.name}
                            sx={{width: 120, height: 120, mb: 2}}
                        />
                        <CardContent sx={{textAlign: "center"}}>
                            <Typography variant="h6" fontWeight="bold">{pet.name}</Typography>
                            <Typography variant="body2" color="text.secondary">DOB: {pet.dateOfBirth}</Typography>
                            <Typography variant="body2" color="text.secondary">Type: {pet.species}</Typography>
                            <Typography variant="body2" color="text.secondary">Breed: {pet.breed}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Pet Details Dialog */}
            {selectedPet && <PetDetailsPopup pet={selectedPet} onClose={handleClosePet}/>}

            {/* Add Pet Dialog */}
            <AddPetPopup open={openAddPet} onClose={handleCloseAddPet} onAdd={handleAddPet}/>
        </Box>
    );
};

export default PetPage;
