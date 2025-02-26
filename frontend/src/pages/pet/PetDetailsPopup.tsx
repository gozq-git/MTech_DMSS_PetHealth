import {Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button} from "@mui/material";

interface Pet {
    name: string;
    image: string;
    gender: string;
    species: string;
    breed: string;
    dateOfBirth: string;
    age: number;
    weight: number;
    height: number;
    length: number;
    neckGirth: number | unknown;
    chestGirth: number | unknown;
    lastMeasured: Date | null;
    isNeutered: boolean;
    microchipNumber: number;
    lastUpdated: Date | null;
    dateAdded: Date | null;

}

interface PetDetailsPopupProps {
    pet: Pet;
    onClose: () => void;
}

const PetDetailsPopup: React.FC<PetDetailsPopupProps> = ({pet, onClose}) => {
    const petProperties = [
        {key: 'age', label: 'Age'},
        {key: 'gender', label: 'Gender'},
        {key: 'species', label: 'Type'},
        {key: 'breed', label: 'Breed'},
        {key: 'weight', label: 'Weight', format: (value: number) => `${value} kg`},
        {key: 'height', label: 'Height', format: (value: number) => `${value} cm`},
        {key: 'length', label: 'Length', format: (value: number) => `${value} cm`},
        {key: 'isNeutered', label: 'Neutered', format: (value: boolean) => value ? 'Yes' : 'No'},
    ];
    const petDetails = petProperties.map(property => {
        const key = property.key as keyof Pet;
        const value = pet[key];

        // Skip null or undefined values
        if (value === null || value === undefined) return null;

        // Format the value if a formatter is provided
        const displayValue = property.format ? property.format(value) : String(value);

        return (
            <Typography key={property.key.toString()}>{property.label}: {displayValue}</Typography>
        );
    });
    return (
        <Dialog open={Boolean(pet)} onClose={onClose}>
            <DialogTitle>{pet.name}</DialogTitle>
            <DialogContent>
                <img src={pet.image} alt={pet.name} style={{width: "100%"}}/>
                {petDetails}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PetDetailsPopup;