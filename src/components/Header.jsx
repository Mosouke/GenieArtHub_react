import React from "react";
import { Link } from "react-router-dom";
import LogoWhite from "/img/logo-white.png"

function Header() {
  return (
    <header>
      <div className="row">
        <Link to="/">
          <img src={LogoWhite} alt="Logo du site GeniArtHub" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
