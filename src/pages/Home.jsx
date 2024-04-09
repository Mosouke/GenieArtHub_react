// Importation des modules nécessaires depuis React et d'autres fichiers
import React, { useEffect, useState } from "react";
import Header from "../components/Header"; // Import du composant Header
import Footer from "../components/Footer"; // Import du composant Footer
import { Link } from "react-router-dom"; // Import de la fonction Link pour la navigation entre les pages
import "../css/style.css"; // Import du fichier de style CSS

// Définition du composant Home
function Home() {
    // Déclaration d'un état pour stocker les données des produits
    const [datas, setDatas] = useState([]);

    // Utilisation de useEffect pour effectuer une action lors du chargement du composant
    useEffect(() => {
        // Fonction asynchrone pour récupérer les données des produits depuis l'API
        const fetchData = async () => {
            try {
                // Requête pour récupérer les données depuis l'API
                const response = await fetch("http://localhost:3000/api/products");
                // Conversion de la réponse en format JSON
                const data = await response.json();
                // Mise à jour de l'état avec les données récupérées
                setDatas(data);
            } catch (error) {
                // Gestion des erreurs en cas d'échec de la récupération des données
                console.error("Error fetching data:", error);
            }
        };

        // Appel de la fonction fetchData pour récupérer les données des produits lors du chargement du composant
        fetchData();
    }, []);

    // Rendu du composant Home
    return (
        <>
            {/* Affichage du composant Header */}
            <Header />
            {/* Section principale avec un message d'accueil et un lien vers la section AI Art Shop */}
            <section className="hero">
                <div className="row">
                    <h1>Explorez l'AI-magination artistique</h1>
                    <Link to="#aiartshop">AI Art Shop</Link>
                </div>
            </section>

            {/* Section AI Art Shop avec la liste des produits */}
            <section id="aiartshop" className="productlist">
                <div>
                    {/* Affichage du logo et du lien vers le panier */}
                    <img src="/img/logo-black.png" alt="Logo GeniArtHub version sombre" />
                    <Link id="carticon" to="cart"><img src="/img/cart.svg" alt="Aller au panier" /></Link>
                </div>
                {/* Affichage des articles disponibles dans la section AI Art Shop */}
                <section className="products">
                {datas.map(el => (
                    <article key={el._id}>
                        <img src={el.image} alt={el.titre} />
                        <Link to={`/product/${el._id}`}>Buy {el.shorttitle}</Link>
                    </article>
                ))}
                </section>
            </section>
            {/* Affichage du composant Footer */}
            <Footer />
        </>
    );
}

// Exportation du composant Home pour pouvoir l'utiliser ailleurs dans l'application
export default Home;
