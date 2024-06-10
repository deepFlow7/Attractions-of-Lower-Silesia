import { NewUser } from './types';

export default async function signUp(userData : NewUser){
    try {
        const response = await fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: userData.name,
                surname: userData.surname,
                mail: userData.mail,
                login: userData.login,
                password: userData.password
            })
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error during login:', error);
        return false;
    }
}