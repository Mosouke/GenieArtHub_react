import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import LogoPanier from "../components/LogoPanier";
import ShowInfosModal from "../components/Modale";

const Productes = () => {
    const [product, setProduct] = useState(null);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [selectedDeclinaison, setSelectedDeclinaison] = useState(null); 
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getDatas();
            setProduct(data);
            if (data.declinaisons && data.declinaisons.length > 0) {
                setSelectedDeclinaison(data.declinaisons[0]);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(cartFromLocalStorage);
    }, []);

    const getDatas = async () => {
        const req = await fetch(`http://localhost:3000/api/products/${id}`);
        return req.json();
    };

    const handleDeclinaisonChange = (e) => {
        const selectedIndex = e.target.value;
        const selected = product.declinaisons[selectedIndex];
        setSelectedDeclinaison(selected);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();

        const quantityInput = document.getElementById("quantity");
        const formatInput = document.getElementById("format");

        const quantity = parseInt(quantityInput.value);
        const format = formatInput.value;

        if (quantity <= 0) {
            setError("La quantité doit être d'au moins 1");
            return;
        }

        if (quantity > 100) {
            setError("La quantité doit être de 100 maximum");
            return;
        }

        const existingProductIndex = cart.findIndex(item => item.id === product._id && item.taille === format);
        
        if (existingProductIndex === -1) {
            const newCartItem = {
                id: product._id,
                taille: format,
                quantite: quantity,
                index: formatInput.options[formatInput.selectedIndex].dataset.index
            };
            const updatedCart = [...cart, newCartItem];
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            handleShowInfoModal("Produit ajouté au panier");
        } else {
            const currentQuantity = cart[existingProductIndex].quantite;
            const newQuantity = currentQuantity + quantity;
            if (newQuantity > 100) {
                setError("La quantité doit être de 100 maximum");
                return;
            }
            cart[existingProductIndex].quantite = newQuantity;
            setCart([...cart]);
            localStorage.setItem("cart", JSON.stringify(cart));
            handleShowInfoModal("Produit ajouté au panier");
        }
    };

    const handleShowInfoModal = (message) => {
        setShowInfoModal(true);
        setTimeout(() => {
            setShowInfoModal(false);
        }, 3000);
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <main className="page">
            <LogoPanier />
            <section className="detailoeuvre">
                <article>
                    <figure>
                        <img src={product.image} alt={product.titre} />
                    </figure>
                    <div>
                        <h1>{product.titre}</h1>
                        <p>{product.description.substring(0, 240)}...</p>
                        <div className="price">
                            <p>Acheter pour</p>
                            {selectedDeclinaison && <span className="showprice">{selectedDeclinaison.prix}€</span>}
                        </div>
                        <div className="declinaison">
                            <input type="number" name="quantity" id="quantity" placeholder="1" defaultValue="1" min="1" />
                            <select name="format" id="format" onChange={handleDeclinaisonChange}>
                                {product.declinaisons.map((declinaison, index) => (
                                    <option key={index} value={declinaison.taille}>{declinaison.taille}</option>
                                ))}
                            </select>
                        </div>
                        <button className="button-buy" onClick={handleAddToCart}>Acheter {product.shorttitle}</button>
                        {error && <ShowInfosModal message={error} />}
                        {showInfoModal && <ShowInfosModal message="Votre Article à bien été ajouté au panier"/>}
                    </div>
                </article>

                <aside>
                    <h2>Description de l’oeuvre : {product.titre}</h2>
                    <p>{product.description}</p>
                </aside>
            </section>
            <Footer />
        </main>
    );
};

export default Productes;


