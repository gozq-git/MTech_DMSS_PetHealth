import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from "@mui/material";

interface Pet {
    name: string;
    image: string;
    age: number;
    type: string;
    breed: string;
}

interface PetDetailsPopupProps {
    pet: Pet;
    onClose: () => void;
}

const PetDetailsPopup: React.FC<PetDetailsPopupProps> = ({ pet, onClose }) => {
    return (
        <Dialog open={Boolean(pet)} onClose={onClose}>
            <DialogTitle>{pet.name}</DialogTitle>
            <DialogContent>
                <img src={pet.image} alt={pet.name} style={{ width: "100%" }} />
                <Typography>Age: {pet.age}</Typography>
                <Typography>Type: {pet.type}</Typography>
                <Typography>Breed: {pet.breed}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PetDetailsPopup;