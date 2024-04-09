import React, { useEffect, useState } from 'react';
import LogoPanier from '../components/LogoPanier';
import Footer from '../components/Footer';
import ShowInfosModal from "../components/Modale";

// Fonction asynchrone pour récupérer les produits depuis l'API
async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:3000/api/products");
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

function Cart() {
    // Déclaration des états
    const [cart, setCart] = useState([]); // État du panier
    const [products, setProducts] = useState([]); // État des produits récupérés depuis l'API
    const [formError, setFormError] = useState(null); // État pour stocker les erreurs de formulaire
    const [submitting, setSubmitting] = useState(false); // État pour gérer la soumission du formulaire
    const [showModal, setShowModal] = useState(false); // État pour afficher ou masquer la modal
    const [modalMessage, setModalMessage] = useState(""); // État pour le message affiché dans la modal
    const [modalTitle, setModalTitle] = useState(""); // État pour le titre affiché dans la modal

    // Effet pour charger les produits depuis l'API et le panier depuis le localStorage lors du chargement de la page
    useEffect(() => {
        const init = async () => {
            const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || [];
            const productsFromApi = await fetchProducts();
            setCart(cartFromStorage);
            setProducts(productsFromApi);
        };
        init();
    }, []);

    // Fonction pour supprimer un article du panier
    const handleDelete = (id, taille) => {
        const updatedCart = cart.filter(item => !(item.id === id && item.taille === taille));
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Fonction pour mettre à jour la quantité d'un article dans le panier
    const handleQuantityChange = (id, taille, quantite) => {
        quantite = parseInt(quantite);
        if (isNaN(quantite) || quantite < 1) {
            return;
        }
        const updatedCart = cart.map(item => {
            if (item.id === id && item.taille === taille) {
                return { ...item, quantite };
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Fonction pour calculer le nombre total d'articles dans le panier
    const getTotalArticles = () => cart.reduce((total, item) => total + parseInt(item.quantite), 0);

    // Fonction pour calculer le montant total de la commande
    const getTotalAmount = () => cart.reduce((total, item) => {
        const product = products.find(product => product._id === item.id);
        const declinaison = product && product.declinaisons.find(declinaison => declinaison.taille === item.taille);
        return total + (declinaison && declinaison.prix ? parseFloat(declinaison.prix) * parseInt(item.quantite) : 0);
    }, 0);

    // Fonction de soumission du formulaire de commande
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (cart.length === 0) {
            setFormError("Votre panier est vide. Ajoutez des articles avant de passer commande.");
            return;
        }
        setSubmitting(true);
        const form = event.target;
        const data = new FormData(form);
        
        // Validation des champs du formulaire
        const validations = [
            { field: "prenom", min: 2, regex: /^[a-zA-Z\sàéèêîôùû\-]*$/, message: "Le prénom doit contenir au moins 2 caractères et ne doit pas contenir de caractères spéciaux" },
            { field: "nom", min: 2, regex: /^[a-zA-Z\sàéèêîôùû\-]*$/, message: "Le nom doit contenir au moins 2 caractères et ne doit pas contenir de caractères spéciaux" },
            { field: "adresse", min: 10, regex: /^[a-zA-Z0-9\sàéèêîôùû\-]*$/, message: "L'adresse doit contenir au moins 10 caractères et ne doit pas contenir de caractères spéciaux" },
            { field: "ville", min: 3, regex: /^[a-zA-Z\sàéèêîôùû\-]*$/, message: "La ville doit contenir au moins 3 caractères et ne doit pas contenir de caractères spéciaux" },
            { field: "mail", regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, message: "L'email n'est pas valide" }
        ];

        for (const validation of validations) {
            const value = data.get(validation.field);
            if (validation.min && value.length < validation.min) {
                setFormError(validation.message);
                setSubmitting(false);
                return;
            }
            if (validation.regex && !validation.regex.test(value)) {
                setFormError(validation.message);
                setSubmitting(false);
                return;
            }
        }

        const contact = {
            firstName: data.get("prenom"),
            lastName: data.get("nom"),
            address: data.get("adresse"),
            city: data.get("ville"),
            email: data.get("mail")
        }

        const productIds = cart.map(item => item.id);

        try {
            const response = await fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ contact, products: productIds })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi du formulaire');
            }

            const responseData = await response.json();
            setFormError(null);
            setModalTitle("Commande enregistrée");
            setModalMessage(`Votre commande a bien été enregistrée, voici votre numéro de commande : ${responseData.orderId}`);
            setShowModal(true);
            setCart([]);
            localStorage.removeItem("cart");
            form.reset();
        } catch (error) {
            console.error('Erreur lors de l\'envoi du formulaire:', error);
            setFormError("Une erreur s'est produite lors de l'envoi de votre commande. Veuillez réessayer plus tard.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="page">
                <LogoPanier />
            </div>
            <main className="cart">
                <section>
                    <h2>Votre Panier</h2>
                    <div id="panier">
                        {/* Affichage des articles dans le panier */}
                        {cart.map((item, index) => {
                            const product = products.find(product => product._id === item.id);
                            const declinaison = product && product.declinaisons.find(declinaison => declinaison.taille === item.taille);
                            return (
                                <article className="article" key={`${item.id}-${index}`}>
                                    <img src={product && product.image} alt={product && product.titre} />
                                    <h3>{product && product.titre}</h3>
                                    <p>Format : {item.taille}</p>
                                    <p className="price">{declinaison && declinaison.prix ? `${declinaison.prix}€` : 'Prix non disponible'}</p>
                                    <div>
                                        <p>Quantité : </p>
                                        <input
                                            type="number"
                                            value={item.quantite}
                                            onChange={e => handleQuantityChange(item.id, item.taille, e.target.value)}
                                            min="1"
                                        />
                                    </div>
                                    <button onClick={() => handleDelete(item.id, item.taille)}>Supprimer</button>
                                </article>
                            );
                        })}
                    </div>
                    <div className="total">
                        {/* Affichage du total de la commande */}
                        <h3>Total de la commande</h3>
                        <p id="total">
                            <span id="totalarticle">{getTotalArticles()}</span> articles pour un montant de <span id="montanttotal">{getTotalAmount().toFixed(2)}</span>€
                        </p>
                    </div>
                </section>
                <section>
                    <h2>Formulaire de commande</h2>
                    {/* Affichage des erreurs de formulaire */}
                    {formError && <ShowInfosModal message={formError} title="Erreur" duration={5000} />} 
                    {/* Affichage de la modal */}
                    {showModal && <ShowInfosModal message={modalMessage} title={modalTitle} duration={30000} />}
                    {/* Formulaire de commande */}
                    <form onSubmit={handleSubmit} id="command">
                        <div>
                            {/* Champs du formulaire */}
                            <div>
                                <label htmlFor="prenom">Prénom: </label>
                                <input type="text" name="prenom" required aria-label="Prénom" />
                            </div>
                            <div>
                                <label htmlFor="nom">Nom: </label>
                                <input type="text" name="nom" required aria-label="Nom" />
                            </div>
                            <div>
                                <label htmlFor="adresse">Adresse: </label>
                                <input type="text" name="adresse" required aria-label="Adresse" />
                            </div>
                            <div>
                                <label htmlFor="ville">Ville: </label>
                                <input type="text" name="ville" required aria-label="Ville" />
                            </div>
                            <div>
                                <label htmlFor="mail">Email: </label>
                                <input type="email" name="mail" required aria-label="Email" />
                            </div>
                        </div>

                        {/* Bouton de soumission du formulaire */}
                        <button className="button-buy" type="submit" disabled={submitting}>Passer commande</button>
                    </form>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default Cart;
