
import LogoPanier from "../components/LogoPanier"
import Footer from '../components/Footer';

function Cart () {
    return (
        <>
            <div className="page">
                <LogoPanier />
            </div>
            <main className="cart">
                <section>
                    <h2>Votre Panier</h2>
                    <div id="panier">

                    </div>
                    <div className="total">
                        <h3>Total de la commande</h3>
                        <p id="total"><span id="totalarticle">0</span> articles pour un montant de <span id="montanttotal">0</span>€</p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Cart;