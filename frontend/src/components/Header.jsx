import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-transparent w-full md:mx-4 lg:mx-8">
      <div className="w-full mx-auto flex items-center justify-between py-4 px-2  lg:px-6">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold hover:cursor-pointer">
          <img src="/logo.png" alt="Logo" className="w-36 cursor-pointer" />
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex bg-transparent space-x-6">
          <NavLink
            to="/"
            className="text-gray-700 hover:text-teal active:text-teal"
          >
            Accueil
          </NavLink>
          <NavLink
            to="/comment-ca-marche"
            className="text-gray-700 hover:text-teal"
          >
            Comment ça marche
          </NavLink>
          <NavLink to="/credits" className="text-gray-700 hover:text-teal">
            Nous connaitre
          </NavLink>
        </nav>

        {/* Sign In Button (Desktop) */}
        <div className="mx-4 hidden md:flex">
          <button className="bg-navy text-white px-4 py-1 rounded-lg hover:bg-blue-600">
            Se Connecter
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden  px-6 py-4 text-center">
          <NavLink
            exact
            to="/"
            className="block text-gray-700 hover:text-teal py-2"
            onClick={toggleMobileMenu}
          >
            Accueil
          </NavLink>
          <NavLink
            to="/comment-ca-marche"
            className="block text-gray-700 hover:text-teal py-2"
            onClick={toggleMobileMenu}
          >
            Comment ça marche
          </NavLink>
          <NavLink
            to="/credits"
            className="block text-gray-700 hover:text-teal py-2"
            onClick={toggleMobileMenu}
          >
            Nous connaitre
          </NavLink>
          <button
            className="block bg-navy w-[200px] mx-auto  text-white md:w-full text-center px-4 py-2 rounded-lg mt-4 "
            onClick={toggleMobileMenu}
          >
            Se Connecter
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
