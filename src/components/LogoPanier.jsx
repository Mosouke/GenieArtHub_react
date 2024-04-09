import React from 'react';
import { Link } from "react-router-dom";
import CartIcon from './CartIcon'; 
function LogoPanier() {
    return(
        <header className="page">
            <div className="row">
                <Link to="/"><img src="/img/logo-black.png" alt="Logo GeniArtHub version sombre" /></Link>
                <Link to="/cart">
                    <img src="/img/cart.svg" alt="Aller au panier" />
                    <CartIcon /> {/* Ajoute le composant CartIcon ici */}
                </Link>
            </div>
        </header>
    )
}

export default LogoPanier;
