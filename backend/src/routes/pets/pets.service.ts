import {sequelize} from "../../db";
import {v6 as uuidv6} from "uuid";
import {format} from "date-fns";
import {UUIDV4} from "sequelize";

const models = sequelize.models;

const PetsService = {
    getPets: async () => {
        const pets = await models.PETS.findAll({});
        return pets;
    },
    retrievePet: async (id: string) => {
        const pet = await models.PETS.findOne({
            where: {
                id
            }
        });
        return pet;
    },
    getPetsByOwner: async (ownerId: string) => {
        const pets = await models.PETS.findAll({
            where: {
                owner_id: ownerId
            }
        });
        return pets;
    },
    insertPet: async (petData: any) => {
        const preparedPetData = {
            id: uuidv6(),
            owner_id: petData.ownerId || '',
            name: petData.name || '',
            gender: petData.gender || '',
            species: petData.species || '',
            breed: petData.breed || '',
            date_of_birth: petData.dateOfBirth ? format(new Date(petData.dateOfBirth), 'yyyy-MM-dd HH:mm:ss') : null,
            weight: petData.weight || null,
            height_cm: petData.height || null,
            length_cm: petData.length || null,
            neck_girth_cm: petData.neckGirthCm || null,
            chest_girth_cm: petData.chestGirthCm || null,
            last_measured: petData.lastMeasured ? new Date(petData.lastMeasured) : null,
            is_neutered: petData.isNeutered || false,
            microchip_number: petData.microchipNumber || '',
            photo_url: petData.photoUrl || '',
            created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            is_deleted: false,
            // Why these fields?
            account_type: null,
            last_active: null,
            account_created: null,
            bio: null,
            profile_picture: null,
            display_name: null
        };

        try {
            console.log('Prepared Pet Data:', preparedPetData);
            const newPet = await models.PETS.create(preparedPetData);
            return newPet;
        } catch (error) {
            console.error('Error inserting pet:', error);
            throw error;
        }
    }
}

export default PetsService;