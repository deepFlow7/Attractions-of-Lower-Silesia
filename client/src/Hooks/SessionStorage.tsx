import { useState, useEffect } from "react";


export const useSessionStorage = (key:string, initialValue:any) => {
    const [value, setValue] = useState(() => {
        const storedValue = sessionStorage.getItem(key);
        return storedValue ?
            JSON.parse(storedValue) :
            initialValue;
    });

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};