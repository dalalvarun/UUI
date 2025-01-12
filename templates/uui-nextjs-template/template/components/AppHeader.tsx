import logo from "../icons/logo.svg";
import { BurgerButton, MainMenu, MainMenuButton } from "@epam/promo";
import { useCallback } from "react";

export const AppHeader = () => {
    const handleShowAlert = useCallback(() => {
        alert('Demo alert');
    }, [])
    const handleRenderBurger = useCallback(() => {
        return (
            <BurgerButton caption="Show modal dialog" onClick={ handleShowAlert } />
        );
    }, [handleShowAlert]);
    return (
        <MainMenu appLogoUrl={ logo.src } logoWidth={ 168 } renderBurger={ handleRenderBurger }>
            <MainMenuButton caption='Home' link={ { pathname: '/' } } priority={ 1 } estimatedWidth={ 72 } />
        </MainMenu>
    )
}
