import {Pet} from "../../api/types/pet.ts";
import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

interface PetDetailsPopupProps {
    pet: Pet;
    onClose: () => void;
}

type PetPropertyConfig<K extends keyof Pet> = {
    key: K;
    label: string;
    format?: (value: Pet[K]) => string;
};

const PetDetailsPopup: React.FC<PetDetailsPopupProps> = ({pet, onClose}) => {
    // Define the properties with proper typing
    const petProperties: PetPropertyConfig<keyof Pet>[] = [
        {key: 'gender', label: 'Gender'},
        {key: 'species', label: 'Type'},
        {key: 'breed', label: 'Breed'},
        {key: 'dateOfBirth', label: 'Date of Birth'},
        {key: 'weight', label: 'Weight', format: (value) => `${value} kg`},
        {key: 'height', label: 'Height', format: (value) => `${value} cm`},
        {key: 'neckGirthCm', label: 'Neck Girth', format: (value) => `${value} cm`},
        {key: 'chestGirthCm', label: 'Chest Girth', format: (value) => `${value} cm`},
        {key: 'lastMeasured', label: 'Last Measured Date'},
        {key: 'isNeutered', label: 'Neutered', format: (value) => value ? 'Yes' : 'No'},
        {key: 'microchipNumber', label: 'Microchip Number'},
        {key: 'createdAt', label: 'Created At'},
        {key: 'updatedAt', label: 'Updated At'}
    ];

    const petDetails = petProperties.map(property => {
        const value = pet[property.key];

        // Skip null or undefined values
        if (value === null || value === undefined) return null;

        // Format the value if a formatter is provided
        const displayValue = property.format
            ? property.format(value)
            : String(value);

        return (
            <Typography key={property.key}>{property.label}: {displayValue}</Typography>
        );
    });
    return (
        <Dialog open={Boolean(pet)} onClose={onClose}>
            <DialogTitle>{pet.name}</DialogTitle>
            <DialogContent>
                <Avatar
                    src={pet.photoUrl}
                    alt={pet.name}
                    sx={{
                        width: 120,
                        height: 120,
                        border: '4px solid white',
                        mb: 2
                    }}
                />
                {petDetails}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PetDetailsPopup;