import React, { useEffect, useState } from 'react';
import LogoPanier from '../components/LogoPanier';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

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
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const init = async () => {
            const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || [];
            const productsFromApi = await fetchProducts();
            setCart(cartFromStorage);
            setProducts(productsFromApi);
        };
        init();
    }, []);

    const handleDelete = (id, taille, ) => {
        const updatedCart = cart.filter(item => !(item.id === id && item.taille === taille));
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleQuantityChange = (id, taille, quantite) => {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.taille === taille) {
                return { ...item, quantite };
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const getTotalArticles = () => cart.reduce((total, item) => total + parseInt(item.quantite), 0);

    const getTotalAmount = () => cart.reduce((total, item) => {
        const product = products.find(product => product._id === item.id);
        const declinaison = product && product.declinaisons.find(declinaison => declinaison.taille === item.taille);
        return total + (declinaison && declinaison.prix ? parseFloat(declinaison.prix) * parseInt(item.quantite) : 0);
    }, 0);

    return (
        <>
            <div className="page">
                <LogoPanier/>
            </div>
            <main className="cart">
                <section>
                    <h2>Votre Panier</h2>
                    <div id="panier">
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
                                    <Link to="/cart" onClick={() => handleDelete(item.id, item.taille)}>Supprimer</Link>
                                </article>
                            );
                        })}
                    </div>
                    <div className="total">
                        <h3>Total de la commande</h3>
                        <p id="total">
                            <span id="totalarticle">{getTotalArticles()}</span> articles pour un montant de <span id="montanttotal">{getTotalAmount().toFixed(2)}</span>€
                        </p>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}

export default Cart;
