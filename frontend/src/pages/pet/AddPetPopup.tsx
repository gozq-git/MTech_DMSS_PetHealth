import React, {useState} from "react";
import {Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button} from "@mui/material";
import {Pet} from "../../api/types/pet.ts";

interface AddPetPopupProps {
    open: boolean;
    onClose: () => void;
    onAdd: (pet: Pet) => void;
}

const AddPetPopup: React.FC<AddPetPopupProps> = ({open, onClose, onAdd}) => {
    const [newPet, setNewPet] = useState<Pet>({
        breed: "",
        chestGirthCm: 0,
        createdAt: "",
        dateOfBirth: "",
        gender: "",
        height: 0,
        id: "",
        isDeleted: false,
        isNeutered: false,
        lastMeasured: "",
        microchipNumber: "",
        name: "",
        neckGirthCm: 0,
        ownerId: "",
        photoUrl: "",
        species: "other",
        updatedAt: "",
        weight: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPet({...newPet, [e.target.name]: e.target.value});
    };

    const handleSubmit = () => {
        onAdd(newPet);
        setNewPet({
            breed: "",
            chestGirthCm: 0,
            createdAt: "",
            dateOfBirth: "",
            gender: "",
            height: 0,
            id: "",
            isDeleted: false,
            isNeutered: false,
            lastMeasured: "",
            microchipNumber: "",
            name: "",
            neckGirthCm: 0,
            ownerId: "",
            photoUrl: "",
            species: "other",
            updatedAt: "",
            weight: 0
        });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Pet</DialogTitle>
            <DialogContent>
                <TextField name="name" label="Name" fullWidth margin="dense" value={newPet.name}
                           onChange={handleChange}/>
                <TextField name="dateOfBirth" label="Date Of Birth" type="number" fullWidth margin="dense" value={newPet.dateOfBirth}
                           onChange={handleChange}/>
                <TextField name="species" label="Species" fullWidth margin="dense" value={newPet.species}
                           onChange={handleChange}/>
                <TextField name="breed" label="Breed" fullWidth margin="dense" value={newPet.breed}
                           onChange={handleChange}/>
                <TextField name="photo" label="Photo URL" fullWidth margin="dense" value={newPet.photoUrl}
                           onChange={handleChange}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPetPopup;
