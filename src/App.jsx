import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Productes from './pages/Products';
import Cart from './pages/Cart';



function App () {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<Productes />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </Router>
    )
}

export default App