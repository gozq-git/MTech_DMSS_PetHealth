import {Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button} from "@mui/material";
import {Pet} from "../../api/types/pet.ts";

// interface Pet {
//     name: string;
//     image: string;
//     gender: string;
//     species: string;
//     breed: string;
//     dateOfBirth: string;
//     age: number;
//     weight: number;
//     height: number;
//     length: number;
//     neckGirth: number | unknown;
//     chestGirth: number | unknown;
//     lastMeasured: Date | null;
//     isNeutered: boolean;
//     microchipNumber: number;
//     lastUpdated: Date | null;
//     dateAdded: Date | null;
// }

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
                <img src={pet.photoUrl} alt={pet.name} style={{width: "100%"}}/>
                {petDetails}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PetDetailsPopup;