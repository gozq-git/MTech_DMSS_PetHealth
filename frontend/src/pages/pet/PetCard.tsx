import {Avatar, Box, Card, CardContent, Chip, Typography} from "@mui/material";
import {Pet} from "../../api/types/pet.ts";
import React from "react";
import {calculateAge} from "./util/ageCalculator.ts";

export interface PetCardProps {
    pet: Pet;
    selectedPet: Pet | null;
    handleOpenPet: (pet: Pet) => void;
}

export const PetCard : React.FC<PetCardProps> = ({pet,selectedPet,handleOpenPet}) =>{
    return(
        <Card
            sx={{
                height: '100%',
                // display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 4,
                boxShadow: 3,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {boxShadow: 6},
                border: selectedPet?.id === pet.id ? '2px solid' : 'none',
                borderColor: 'primary.main'
            }}
            onClick={() => handleOpenPet(pet)}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                bgcolor: 'primary.light',
                color: 'white'
            }}>
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
                <Typography variant="h5" fontWeight="bold">{pet.name}</Typography>
                <Typography variant="body1">
                    {pet.dateOfBirth ? calculateAge(pet.dateOfBirth) : 'Age unknown'}
                </Typography>
                <Box sx={{display: 'flex', mt: 1, gap: 1}}>
                    <Chip
                        label={pet.species}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{bgcolor: 'rgba(255,255,255,0.8)', color: 'primary.dark'}}
                    />
                    <Chip
                        label={pet.breed}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{bgcolor: 'rgba(255,255,255,0.8)', color: 'primary.dark'}}
                    />
                </Box>
            </Box>
            <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" sx={{mb: 1}}>ID &
                    Registration</Typography>
                {pet.microchipNumber && (
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                        <Typography variant="body2" color="text.secondary">Microchip</Typography>
                        <Typography variant="body2"
                                    fontWeight="medium">{pet.microchipNumber}</Typography>
                    </Box>
                )}
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="body2" color="text.secondary">Registered</Typography>
                    <Typography variant="body2" fontWeight="medium">
                        {new Date(pet.createdAt).toLocaleDateString()}
                    </Typography>
                </Box>
            </CardContent>
            {/*<Box sx={{*/}
            {/*    p: 2,*/}
            {/*    width: '100%',*/}
            {/*    display: 'flex',*/}
            {/*    flexDirection: 'column',*/}
            {/*    alignItems: 'center'*/}
            {/*}}>*/}
            {/*    /!* Circular Avatar *!/*/}
            {/*    <Avatar*/}
            {/*        src={pet.photoUrl}*/}
            {/*        alt={pet.name}*/}
            {/*        sx={{width: 80, height: 80, mb: 1}}*/}
            {/*    />*/}
            {/*    <CardContent sx={{textAlign: "center", p: 1, "&:last-child": {pb: 1}}}>*/}
            {/*        <Typography variant="h6" fontWeight="bold">{pet.name}</Typography>*/}
            {/*        <Typography variant="body2" color="text.secondary">*/}
            {/*            {pet.species} • {pet.breed}*/}
            {/*        </Typography>*/}
            {/*    </CardContent>*/}
            {/*</Box>*/}
        </Card>
    )
}