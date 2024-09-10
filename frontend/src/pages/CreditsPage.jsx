import React from "react";
import PageWrapper from "../components/Layouts/PageWrapper";
const credits = [
  { name: "John Doe" },
  { name: "Jane Smith" },
  { name: "Michael Brown" },
];

const CreditsPage = () => {
  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-center text-teal">Credits</h1>
      <div className="mt-8 space-y-4">
        {credits.map((person, index) => (
          <div
            key={index}
            className="flex justify-between p-4 bg-white shadow-lg rounded-lg items-center"
          >
            <span className="font-medium">{person.name}</span>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default CreditsPage;
