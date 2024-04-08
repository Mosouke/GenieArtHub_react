import { Link } from "react-router-dom";

function LogoPanier() {
    return(
        <header className="page">
            <div className=" row">
                <Link to="/"><img src="/img/logo-black.png" alt="Logo GeniArtHub version sombre" /></Link>
                <Link id="carticon" to="cart"><img src="/img/cart.svg" alt="Aller au panier" /></Link>
            </div>
        </header>
    )
}

export default LogoPanier;