import { NewAttraction, NewPhoto } from './types';

export default async function addAtraction(attraction : NewAttraction){
    try {
        const response = await fetch('http://localhost:8080/new_attraction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name : attraction.name,
                coords: attraction.coords,
                type: attraction.type,
                subtype: attraction.subtype,
                interactivity: attraction.interactivity,
                time_it_takes: attraction.time_it_takes,
                description: attraction.description,
                photos: attraction.photos
            })
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error :', error);
        return false;
    }
}