import {Pet} from "../../api/types/pet.ts";
import React from "react";
import {Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, useTheme} from "@mui/material";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import PetsIcon from "@mui/icons-material/Pets";
import {toProperCase} from "../../util/toProperCase.ts";

interface PetDetailsPopupProps {
    pet: Pet;
    onClose: () => void;
}

type PetPropertyConfig<K extends keyof Pet> = {
    key: K;
    label: string;
    format?: (value: Pet[K]) => string;
    icon?: React.ReactNode;
    important?: boolean
};

const PetDetailsPopup: React.FC<PetDetailsPopupProps> = ({pet, onClose}) => {
    // Define the properties with proper typing
    const theme = useTheme();
    const petProperties: PetPropertyConfig<keyof Pet>[] = [
        {key: 'species', label: 'Type', important: true},
        {key: 'breed', label: 'Breed', important: true},
        {key: 'gender', label: 'Gender', important: true},
        {key: 'date_of_birth', label: 'Date of Birth', important: true},
        {key: 'weight', label: 'Weight', format: (value) => `${value} kg`},
        {key: 'height_cm', label: 'Height', format: (value) => `${value} cm`},
        {key: 'neck_girth_cm', label: 'Neck Girth', format: (value) => `${value} cm`},
        {key: 'chest_girth_cm', label: 'Chest Girth', format: (value) => `${value} cm`},
        {key: 'last_measured', label: 'Last Measured'},
        {key: 'is_neutered', label: 'Neutered', format: (value) => value ? 'Yes' : 'No'},
        {key: 'microchip_number', label: 'Microchip Number'},
        {key: 'created_at', label: 'Added on'},
        {key: 'updated_at', label: 'Updated'}
    ];
    const importantProperties = petProperties.filter(prop => prop.important);
    const standardProperties = petProperties.filter(prop => !prop.important);


    return (
        <Dialog
            open={Boolean(pet)}
            onClose={onClose}
            fullWidth={true}
            maxWidth={"sm"}
            sx={{borderRadius: 2, overflow: 'hidden'}}
        >
            <DialogTitle
                sx={{
                    p: 0,
                    position: 'relative',
                    height: 200,
                    backgroundImage: `linear-gradient(to bottom, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                    color: 'white'
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'white',
                        bgcolor: 'rgba(0,0,0,0.2)',
                        '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.4)'
                        }
                    }}
                >
                    <CloseIcon/>
                </IconButton>

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Avatar
                        src={pet.photo_url}
                        alt={pet.name}
                        sx={{
                            width: 100,
                            height: 100,
                            border: '4px solid white',
                            boxShadow: 3
                        }}
                    />
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                            mt: 1,
                            textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1
                        }}
                    >
                        {pet.name}'s Health Records
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{pt: 7, pb: 3}}>
                <Grid2 container spacing={2} sx={{my: 3}}>
                    {importantProperties.map(property => {
                        const value = pet[property.key];
                        if (value === null || value === undefined) return null;
                        const displayValue = property.format ? property.format(value) : String(value);
                        return (
                            <Grid2 size={6} key={property.key}>
                                <Box sx={{
                                    // display: 'flex',
                                    alignItems: 'center',
                                    p: 1,
                                    borderRadius: 2,
                                    bgcolor: '#f5f5f5'
                                }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {toProperCase(property.label)}
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {toProperCase(displayValue)}
                                    </Typography>
                                </Box>
                            </Grid2>
                        )
                    })}
                </Grid2>
                <Divider sx={{my: 3}}>
                    <Chip
                        icon={<PetsIcon/>}
                        label="Details"
                        size="small"
                        sx={{px: 1}}
                    />
                </Divider>
                <Grid2 container spacing={2}>
                    {standardProperties.map(property => {
                        const value = pet[property.key];
                        if (value === null || value === undefined) return null;

                        const displayValue = property.format
                            ? property.format(value)
                            : String(value);

                        return (
                            <Grid2 size={{sm: 6, xs: 12}} key={property.key}>
                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography variant="body2" color="text.secondary">
                                        {property.label}:
                                    </Typography>
                                    <Typography variant="body2">
                                        {displayValue}
                                    </Typography>
                                </Box>
                            </Grid2>
                        );
                    })}
                </Grid2>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PetDetailsPopup;