import React from "react";
import PageWrapper from "../components/Layouts/PageWrapper";
const credits = [
  { name: "John Doe", url: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "Jane Smith", url: "https://randomuser.me/api/portraits/men/1.jpg" },
  {
    name: "Michael Brown",
    url: "https://randomuser.me/api/portraits/men/1.jpg",
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
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={"place.png"}
              alt="Portrait of Jane Doe, smiling woman with brown hair"
              className="w-full h-48 object-cover"
              width="300"
              height="200"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {item.name}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 mx-12">
        <h2 className="text-2xl font-bold  text-center text-gray-800 mb-4">
          Remerciements spéciaux
        </h2>
        <ul className="list-disc list-inside text-gray-700 max-w-2xl mx-auto">
          <li>Nos differents mentors pour leurs conseils et leurs retours</li>
          <li>Nos testeurs beta pour leurs retours très utiles</li>
        </ul>
      </div>
    </PageWrapper>
  );
};

export default CreditsPage;
