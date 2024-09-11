import React, { useEffect } from "react";
import PageWrapper from "../components/Layouts/PageWrapper";
import { useRef } from "react";
import { jsPDF } from "jspdf";
import { FiDownload, FiDatabase } from "react-icons/fi";
import BackBtn from "../components/BackBtn";
import Loader from "../components/Loader";
import { useLocation, useParams } from "react-router-dom";
import { DataContext } from "../context/apiContext";
import { useContext } from "react";
import { NavLink } from "react-router-dom";

const API_BASE_INS_URL = import.meta.env.VITE_API_ETU_URI_BASE;

const ItemDetails = () => {
  const { data, updateData } = useContext(DataContext);
  console.log(data);
  const { image } = useParams(); // Get the encoded URL from params
  const decodedUrl = decodeURIComponent(image);
  console.log(decodedUrl);
  const item = data.find((item) => item.image_paths === image);
  console.log(item);

  if (!item)
    return (
      <PageWrapper>
        {" "}
        Analyse non faite car image non trouvee
        <NavLink to="/">
          <button className="px-6 py-2 text-xs mt-4 text-white bg-teal hover:bg-navy rounded-lg shadow-md">
            Retourner a la liste des analyses
          </button>
        </NavLink>
      </PageWrapper>
    );

  const contentRef = useRef(null);

  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const downloadAsPDF = () => {
    const doc = new jsPDF();

    // Custom font styles for the CV header
    doc.setFontSize(24);
    doc.setTextColor("#1d4ed8"); // Tailwind Blue 600
    doc.text("Profil Trouve", 105, 20, null, null, "center"); // Centered title

    // Section: Personal Information
    doc.setFontSize(18);
    doc.setTextColor("#374151"); // Tailwind Gray 700
    doc.text("Informations personelles", 10, 40);

    doc.setFontSize(12);
    doc.setTextColor("#000000");
    let yPos = 50; // Initial Y position after section header

    Object.keys(item).forEach((key, i) => {
      // Skip displaying unnecessary fields
      if (key === "image_paths" || key === "score") return;

      // Display key (field name) in bold
      doc.setFont(undefined, "bold");
      doc.text(`${key}:`, 10, yPos);

      // Move to the next line and display the value in normal font
      yPos += 6; // Adjusted line height for more spacing
      doc.setFont(undefined, "normal");
      doc.text(`${item[key]}`, 10, yPos);

      // Move to the next line for the next key-value pair
      yPos += 10;
    });

    // Section: Analysis Results
    doc.setFontSize(18);
    doc.setTextColor("#374151"); // Tailwind Gray 700
    yPos += 10; // Add some space before the next section
    doc.text("Resultats de l'Analyse", 10, yPos);

    doc.setFontSize(12);
    doc.setTextColor("#000000");
    yPos += 10;
    doc.text(`Score: ${item.score * 100}%`, 10, yPos);

    // Add image
    const img = new Image();
    img.src = API_BASE_INS_URL + "/image/" + item.image_paths;
    img.onload = function () {
      yPos += 10; // Adjust Y position for image placement
      doc.addImage(img, "JPEG", 10, yPos, 50, 50); // Add image with custom dimensions

      // After the image, save the PDF
      doc.save("Suspect_Potentiel.pdf");
    };
    img.onerror = function () {
      console.error("Failed to load image.");
      doc.save("Suspect_Potentiel.pdf"); // Save the PDF even if image fails to load
    };
  };

  const downloadAsSQL = () => {
    let sqlStatement = `
      INSERT INTO  table 
    `;
    for (let i = 0; i < Object.keys(item).length; i++) {
      sqlStatement += `${Object.keys(item)[i]},`;
    }
    sqlStatement += `
    VALUES
    `;
    for (let i = 0; i < Object.keys(item).length; i++) {
      sqlStatement += `${item[Object.keys(item)[i]]},`;
    }
    sqlStatement += `
    `;
    console.log(sqlStatement);
    const blob = new Blob([sqlStatement], { type: "text/sql" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `votre_sql.sql`;
    link.click();
  };

  return (
    <PageWrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container mx-auto p-6" ref={contentRef}>
          <div className="flex flex-col md:flex-row items-center justify-center">
            {/* Image Section */}
            <div className="w-full my-4 md:mx-auto">
              <img
                src={API_BASE_INS_URL + "/image/" + item.image_paths}
                alt={item.image_paths}
                className="w-48 md:mx-auto h-48 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Item Details Section */}
            <div className="w-full  flex flex-col space-y-4 text-teal">
              <div className="space-y-2">
                {Object.keys(item).map((key) => {
                  if (key !== "image_paths") {
                    return (
                      <p key={item[key]} className="text-lg text-teal">
                        <span className="font-bold text-black">{key}:</span>{" "}
                        <span className="text-teal">{item[key]}</span>
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          <div>
            <div className="container mx-auto p-6 flex flex-col md:flex-row justify-center gap-x-4">
              <button
                onClick={downloadAsPDF}
                className="px-6 py-2 text-xs mt-4  text-white bg-teal hover:bg-navy rounded-lg shadow-md"
              >
                Telecharger le PDF <FiDownload className="inline-block" />
              </button>
              <button
                onClick={downloadAsSQL}
                className="px-6 text-xs py-2 mt-4 text-white bg-teal hover:bg-navy rounded-lg shadow-md"
              >
                Telecharger le sql <FiDatabase className="inline-block" />
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default ItemDetails;
