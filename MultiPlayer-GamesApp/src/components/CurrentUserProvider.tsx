import React, { createContext, useState, useContext } from "react";

// Create the context
const CurrentUserContext =  createContext<any | null>(null);

// Create a custom hook to access the context values
export function useCurrentUser() {
    return useContext(CurrentUserContext);
}

// Create a context provider component to wrap the App component
interface CurrentUserProviderProps{
    children: React.ReactNode;
}
export function CurrentUserProvider({ children }: CurrentUserProviderProps){
    const [currentUser, setCurrentUser] = useState(null);
return (
    <CurrentUserContext.Provider value={{currentUser, setCurrentUser}}>
        {children}
    </CurrentUserContext.Provider>
 );
}


