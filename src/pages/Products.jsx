// Importation des modules nécessaires depuis React et d'autres fichiers
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import de la fonction useParams pour obtenir les paramètres d'URL
import Footer from "../components/Footer"; // Import du composant Footer
import LogoPanier from "../components/LogoPanier"; // Import du composant LogoPanier
import ShowInfosModal from "../components/Modale"; // Import du composant ShowInfosModal

// Définition du composant Productes
const Productes = () => {
    // Déclaration des états pour stocker les données du produit, le panier, la déclinaison sélectionnée, les messages d'erreur et d'information
    const [product, setProduct] = useState(null);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [selectedDeclinaison, setSelectedDeclinaison] = useState(null); 
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [error, setError] = useState(null);
    
    // Utilisation de useParams pour obtenir l'ID du produit depuis l'URL
    const { id } = useParams();

    // Utilisation de useEffect pour effectuer une action lors du chargement du composant ou lorsque l'ID du produit change
    useEffect(() => {
        // Fonction asynchrone pour récupérer les données du produit
        const fetchData = async () => {
            // Appel de la fonction getDatas pour récupérer les données du produit
            const data = await getDatas();
            // Mise à jour de l'état avec les données récupérées
            setProduct(data);
            // Sélection de la première déclinaison si des déclinaisons sont disponibles pour le produit
            if (data.declinaisons && data.declinaisons.length > 0) {
                setSelectedDeclinaison(data.declinaisons[0]);
            }
        };
        // Appel de la fonction fetchData lors du chargement du composant ou lorsque l'ID du produit change
        fetchData();
    }, [id]);

    // Utilisation de useEffect pour mettre à jour le panier à partir des données stockées localement lors du chargement du composant
    useEffect(() => {
        const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(cartFromLocalStorage);
    }, []);

    // Fonction asynchrone pour récupérer les données du produit depuis l'API
    const getDatas = async () => {
        const req = await fetch(`http://localhost:3000/api/products/${id}`);
        return req.json();
    };

    // Fonction pour gérer le changement de déclinaison
    const handleDeclinaisonChange = (e) => {
        const selectedIndex = e.target.value;
        const selected = product.declinaisons[selectedIndex];
        setSelectedDeclinaison(selected);
    };

    // Fonction pour ajouter un produit au panier
    const handleAddToCart = (e) => {
        e.preventDefault();

        const quantityInput = document.getElementById("quantity");
        const formatInput = document.getElementById("format");

        const quantity = parseInt(quantityInput.value);
        const format = formatInput.value;

        // Validation de la quantité
        if (quantity <= 0) {
            setError("La quantité doit être d'au moins 1");
            return;
        }

        if (quantity > 100) {
            setError("La quantité doit être de 100 maximum");
            return;
        }

        // Vérification de l'existence du produit dans le panier
        const existingProductIndex = cart.findIndex(item => item.id === product._id && item.taille === format);
        
        // Ajout du produit au panier ou mise à jour de la quantité si le produit existe déjà
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

    // Fonction pour afficher le message d'information pendant une durée spécifique
    const handleShowInfoModal = (message) => {
        setShowInfoModal(true);
        setTimeout(() => {
            setShowInfoModal(false);
        }, 3000);
    };

    // Affichage d'un message de chargement si les données du produit ne sont pas encore disponibles
    if (!product) {
        return <div>Loading...</div>;
    }

    // Rendu du composant Productes
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
                                {/* Affichage des options de déclinaison */}
                                {product.declinaisons.map((declinaison, index) => (
                                    <option key={index} value={declinaison.taille}>{declinaison.taille}</option>
                                ))}
                            </select>
                        </div>
                        {/* Bouton pour ajouter le produit au panier */}
                        <button className="button-buy" onClick={handleAddToCart}>Acheter {product.shorttitle}</button>
                        {/* Affichage du message d'erreur */}
                        {error && <ShowInfosModal message={error} />}
                        {/* Affichage du message d'information */}
                        {showInfoModal && <ShowInfosModal message="Votre Article à bien été ajouté au panier"/>}
                    </div>
                </article>

                <aside>
                    <h2>Description de l’oeuvre : {product.titre}</h2>
                    <p>{product.description}</p>
                </aside>
            </section>
            {/* Affichage du composant Footer */}
            <Footer />
        </main>
    );
};

export default Productes;