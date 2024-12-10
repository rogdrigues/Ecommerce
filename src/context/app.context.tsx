import { createContext, useContext, useState } from "react";

interface IAppContext {
    isAuthenticated: boolean;
    user: IUser | null;
    setIsAuthenticated: (value: boolean) => void;
    setUser: (value: IUser | null) => void;
}

type IProps = {
    children: React.ReactNode;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

export const AppContextProvider = (props: IProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);

    return (
        <CurrentAppContext.Provider
            value={{
                isAuthenticated, user,
                setIsAuthenticated, setUser
            }}>
            {props.children}
        </CurrentAppContext.Provider>
    );
}

//use context function
export const useAppContext = () => {
    const context = useContext(CurrentAppContext);
    if (!context) {
        throw new Error('useAppContext must be used within a AppContextProvider');
    }
    return context;
}