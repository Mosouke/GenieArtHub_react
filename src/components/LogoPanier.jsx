import { Link } from "react-router-dom";

function LogoPanier() {
    return(
        <header className="page">
            <div className=" row">
                <img src="/img/logo-black.png" alt="Logo GeniArtHub version sombre" />
                <Link id="carticon" to="cart.html"><img src="/img/cart.svg" alt="Aller au panier" /></Link>
            </div>
        </header>
    )
}

export default LogoPanier;