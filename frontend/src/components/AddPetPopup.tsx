import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

interface Pet {
    name: string;
    age: number;
    type: string;
    breed: string;
    image: string;
}

interface AddPetPopupProps {
    open: boolean;
    onClose: () => void;
    onAdd: (pet: Pet) => void;
}

const AddPetPopup: React.FC<AddPetPopupProps> = ({ open, onClose, onAdd }) => {
    const [newPet, setNewPet] = useState<Pet>({ name: "", age: 0, type: "", breed: "", image: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPet({ ...newPet, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onAdd(newPet);
        setNewPet({ name: "", age: 0, type: "", breed: "", image: "" });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Pet</DialogTitle>
            <DialogContent>
                <TextField name="name" label="Name" fullWidth margin="dense" value={newPet.name} onChange={handleChange} />
                <TextField name="age" label="Age" type="number" fullWidth margin="dense" value={newPet.age} onChange={handleChange} />
                <TextField name="type" label="Type" fullWidth margin="dense" value={newPet.type} onChange={handleChange} />
                <TextField name="breed" label="Breed" fullWidth margin="dense" value={newPet.breed} onChange={handleChange} />
                <TextField name="image" label="Image URL" fullWidth margin="dense" value={newPet.image} onChange={handleChange} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPetPopup;
