import React, { useEffect, useState } from 'react';

function CartIcon() {
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if(cart.length > 0) {
            const totalQuantity = cart.reduce((acc, el) => acc + parseInt(el.quantite), 0);
            setQuantity(totalQuantity);
        } else {
            setQuantity(0);
        }
    }, []);

    return (
        <div id="carticon">
            {quantity > 0 && <span>{quantity}</span>}
        </div>
    );
}

export default CartIcon;
