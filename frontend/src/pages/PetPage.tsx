import { useState } from "react";
import { 
    Card, CardContent, Typography, Button, Avatar, Box 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PetDetailsPopup from "../components/PetDetailsPopup";
import AddPetPopup from "../components/AddPetPopup";

interface Pet {
    id: number;
    name: string;
    age: number;
    type: string;
    breed: string;
    image: string;
}

const petsData: Pet[] = [
    { id: 1, name: "Whiskers", age: 2, type: "Cat", breed: "Siamese", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Whiskers", age: 2, type: "Cat", breed: "Siamese", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Whiskers", age: 2, type: "Cat", breed: "Siamese", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Whiskers", age: 2, type: "Cat", breed: "Siamese", image: "https://via.placeholder.com/150" }
];

const PetPage = () => {
    const [pets, setPets] = useState<Pet[]>(petsData);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [openAddPet, setOpenAddPet] = useState(false);
    
    const handleOpenPet = (pet: Pet) => setSelectedPet(pet);
    const handleClosePet = () => setSelectedPet(null);
    const handleOpenAddPet = () => setOpenAddPet(true);
    const handleCloseAddPet = () => setOpenAddPet(false);
    
    const handleAddPet = (newPet: Omit<Pet, "id">) => {
        setPets([...pets, { ...newPet, id: pets.length + 1 }]);
        setOpenAddPet(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
            {/* Header Section */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">My Pets</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />} 
                    onClick={handleOpenAddPet}
                    sx={{ borderRadius: "20px", textTransform: "none", fontSize: "16px" }}
                >
                    Add Pet
                </Button>
            </Box>

            {/* Pets List */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
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
                            "&:hover": { boxShadow: 6 }
                        }}
                        onClick={() => handleOpenPet(pet)}
                    >
                        {/* Circular Avatar */}
                        <Avatar 
                            src={pet.image} 
                            alt={pet.name} 
                            sx={{ width: 120, height: 120, mb: 2 }}
                        />
                        <CardContent sx={{ textAlign: "center" }}>
                            <Typography variant="h6" fontWeight="bold">{pet.name}</Typography>
                            <Typography variant="body2" color="text.secondary">Age: {pet.age} years</Typography>
                            <Typography variant="body2" color="text.secondary">Type: {pet.type}</Typography>
                            <Typography variant="body2" color="text.secondary">Breed: {pet.breed}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Pet Details Dialog */}
            {selectedPet && <PetDetailsPopup pet={selectedPet} onClose={handleClosePet} />}

            {/* Add Pet Dialog */}
            <AddPetPopup open={openAddPet} onClose={handleCloseAddPet} onAdd={handleAddPet} />
        </Box>
    );
};

export default PetPage;
