import { useEffect, useState } from "react";

const ShowInfosModal = ({ message, title = "", duration = 3000 }) => {
    const [ isOpen, setIsOpen] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setIsOpen(false), duration);
        return() => clearTimeout(timer);
    }, [duration]);

    if (!isOpen) {
        return null;
    }

    return(
        <dialog open className="modal">
            {title && <h2>{title}</h2>}
            <p>{message}</p>
        </dialog>
    )

};

export default ShowInfosModal;

