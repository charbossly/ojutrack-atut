import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6 text-center">
        Desole 😢 Nous n'avons pas trouvé la page que vous cherchez.
      </p>
      <Link
        to="/"
        className="text-teal-500 hover:text-teal-700 transition duration-300"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
