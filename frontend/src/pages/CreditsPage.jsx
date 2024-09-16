import React from "react";
import PageWrapper from "../components/Layouts/PageWrapper";
const credits = [
  {
    name: "TITO Lucien",
    url: "https://www.linkedin.com/in/vigninnou-lucien-tito",
  },
  {
    name: "Charbel ASSOGBA",
    url: "https://www.linkedin.com/in/mahoudjro-charbel-assogba-5734a6206/",
  },
  {
    name: "Arix ALIMAGNIDOKPO",
    url: "https://www.linkedin.com/in/arix-alimagnidokpo-8200172b6",
  },
  {
    name: "Ronaldo AGBOHOU",
    url: "https://www.linkedin.com/in/ronaldoagbohou",
  },
  {
    name: "Honorine GNONFIN",
    url: "https://www.linkedin.com/in/honorine-gnonfin-293500250",
  },
  {
    name: "Marcos HOGNIFIO",
    url: "https://github.com/marcoshognifio",
  },
  {
    name: "SAGBO Sylvère",
    url: "https://github.com/tchapo-oph",
  },
  {
    name: "Elfrield KINZOUN",
    url: "https://www.linkedin.com/in/elfried-kinzoun-858063278",
  },
  {
    name: "KOUDJO Hervé",
    url: "https://github.com/Herve012",
  },
  {
    name: "Lawson Geovanie",
    url: "https://github.com/karolwell",
  },
  {
    name: "Mallory Lénaic OUENDO",
    url: "https://github.com/lenaic-ouendo-01",
  },
];

const CreditsPage = () => {
  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-center text-teal my-4">Credits</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {credits.map((item, index) => (
          <div
            key={index}
            onClick={() => window.open(item.url, "_blank")}
            className="bg-white rounded-lg shadow-md overflow-hidden flex items-center "
          >
            <img
              src={"place.png"}
              alt="Portrait of Jane Doe, smiling woman with brown hair"
              className="w-24 h-24 rounded-full object-cover"
              width="300"
              height="200"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {item.name}
              </h2>
              <a href={item.url} target="_blank" rel="noreferrer">
                Voir le profil
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 mx-12">
        <h2 className="text-2xl font-bold  text-center text-gray-800 mb-4">
          Remerciements spéciaux
        </h2>
        <ul className="list-disc list-inside text-gray-700 max-w-2xl mx-auto">
          <li>A l'endroit du Programme AFRICA TechUp Tour</li>
          <li>Nos differents mentors pour leurs conseils et leurs retours</li>
          <li>Nos testeurs beta pour leurs retours très utiles</li>
          <li>Nos MLOps pour avoir mis la solution en production</li>
        </ul>
      </div>
    </PageWrapper>
  );
};

export default CreditsPage;
