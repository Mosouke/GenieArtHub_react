import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "../css/style.css";

function Home() {
    const [datas, setDatas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/products");
                const data = await response.json();
                setDatas(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    
    return (
        <>
            <Header />
            <section className="hero">
                <div className="row">
                    <h1>Explorez l'AI-magination artistique</h1>
                    <Link to="#aiartshop">AI Art Shop</Link>
                </div>
            </section>

            <section id="aiartshop" className="productlist">
                <div>
                    <img src="/img/logo-black.png" alt="Logo GeniArtHub version sombre" />
                    <Link id="carticon" to="cart"><img src="/img/cart.svg" alt="Aller au panier" /></Link>
                </div>
                <section className="products">
                {datas.map(el => (
                    <article key={el._id}>
                        <img src={el.image} alt={el.titre} />
                        <Link to={`/product/${el._id}`}>Buy {el.shorttitle}</Link>
                </article>
                ))}
                </section>
            </section>
            <Footer />
        </>
    );
}

export default Home;

