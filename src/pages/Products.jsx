import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import LogoPanier from "../components/LogoPanier";
import ShowInfosModal from "../components/Modale";

const Productes = () => {
    const [product, setProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [selectedDeclinaison, setSelectedDeclinaison] = useState(null); 
    const [showInfoModal, setShowInfoModal] = useState(false);
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

    const addToCart = () => {
        if (!product || !selectedDeclinaison) return;
        const newCartItem = {
            id: product.id,
            taille: selectedDeclinaison.taille, 
            quantite: 1, 
            index: 0, 
        };

        const updatedCart = [...cart, newCartItem];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        
    };

    const handleModal = (e) => {
        
            setShowInfoModal(true);

            setTimeout(() => {
                setShowInfoModal(false);
            }, 3000);
    }
   
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
                                    <option key={index} value={index}>{declinaison.taille}</option>
                                ))}
                            </select>
                        </div>
                        <button className="button-buy" onClick={() => { addToCart(); handleModal(); }}>Buy {product.shorttitle}
                        </button>
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
