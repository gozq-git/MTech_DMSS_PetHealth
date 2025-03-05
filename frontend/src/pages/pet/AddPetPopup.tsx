import React, { useState, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControlLabel, Checkbox } from "@mui/material";
import { ApiClientContext } from "../../providers/ApiClientProvider.tsx";
import { PetCreateInput } from "../../api/types/pet.ts"; // Importing PetCreateInput
import { Pet } from "../../api/types/pet.ts"; // Importing Pet interface (for typing the return type)

interface AddPetPopupProps {
    open: boolean;
    onClose: () => void;
    onAdd: (pet: Pet) => void; // Explicitly typing onAdd with Pet (with id)
}

function AddPetPopup({ open, onClose, onAdd }: AddPetPopupProps) {
    const { petApi } = useContext(ApiClientContext);

    // Define the state to use PetCreateInput interface
    const [newPet, setNewPet] = useState<PetCreateInput>({
        ownerId: "",
        name: "",
        gender: "",
        species: "other",
        breed: "",
        lastMeasured: "",
        microchipNumber: "",
        dateOfBirth: "",
        weight: 0,
        height: 0,
        neckGirthCm: 0,
        chestGirthCm: 0,
        isNeutered: false,
        photoUrl: ""
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target;
        setNewPet(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value
        }));
    }

    async function handleSubmit() {
        setLoading(true);
        try {
            // Ensure that the dateOfBirth is a string or omit it if undefined
            const petToInsert = {
                ...newPet,
                createdAt: new Date().toISOString(), // generated on the frontend
                updatedAt: new Date().toISOString(), // generated on the frontend
                isDeleted: false, // Default value, can be handled on the backend
                dateOfBirth: newPet.dateOfBirth || "", // Default empty string if undefined
                weight: newPet.weight || 0, // Ensure weight is always a number
                height: newPet.height || 0, // Ensure height is always a number
                neckGirthCm: newPet.neckGirthCm || 0, // Ensure neckGirthCm is always a number
                chestGirthCm: newPet.chestGirthCm || 0, // Ensure chestGirthCm is always a number
                isNeutered: newPet.isNeutered ?? false, // Ensure isNeutered is always a boolean
            };

            const createdPet = await petApi.insertPet(petToInsert); // Now passing the proper object to API
            onAdd(createdPet);
            onClose();
        } catch (error) {
            console.error("Error adding pet:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Pet</DialogTitle>
            <DialogContent>
                <TextField name="ownerId" label="Owner ID" fullWidth margin="dense" value={newPet.ownerId} onChange={handleChange} />
                <TextField name="name" label="Name" fullWidth margin="dense" value={newPet.name} onChange={handleChange} />
                <TextField name="gender" label="Gender" fullWidth margin="dense" value={newPet.gender} onChange={handleChange} />
                <TextField name="species" label="Species" fullWidth margin="dense" value={newPet.species} onChange={handleChange} />
                <TextField name="breed" label="Breed" fullWidth margin="dense" value={newPet.breed} onChange={handleChange} />
                <TextField name="microchipNumber" label="Microchip Number" type="number" fullWidth margin="dense" value={newPet.microchipNumber} onChange={handleChange} />
                <TextField name="dateOfBirth" label="Date of Birth" type="date" fullWidth margin="dense" value={newPet.dateOfBirth} onChange={handleChange} />
                <TextField name="weight" label="Weight (kg)" type="number" fullWidth margin="dense" value={newPet.weight} onChange={handleChange} />
                <TextField name="height" label="Height (cm)" type="number" fullWidth margin="dense" value={newPet.height} onChange={handleChange} />
                <TextField name="neckGirthCm" label="Neck Girth (cm)" type="number" fullWidth margin="dense" value={newPet.neckGirthCm} onChange={handleChange} />
                <TextField name="chestGirthCm" label="Chest Girth (cm)" type="number" fullWidth margin="dense" value={newPet.chestGirthCm} onChange={handleChange} />
                <TextField name="photoUrl" label="Photo URL" fullWidth margin="dense" value={newPet.photoUrl} onChange={handleChange} />
                <FormControlLabel control={<Checkbox name="isNeutered" checked={newPet.isNeutered} onChange={handleChange} />} label="Neutered" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
                    {loading ? "Adding..." : "Add Pet"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddPetPopup;
