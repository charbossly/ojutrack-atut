import React from "react";
import PageWrapper from "../components/Layouts/PageWrapper";
import { useEffect } from "react";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import BackBtn from "../components/BackBtn";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { DataContext } from "../context/apiContext";
import { useContext } from "react";

const API_BASE_INS_URL = import.meta.env.VITE_API_ETU_URI_BASE;

const SimilarityUI = () => {
  const { imageSend } = useContext(DataContext);
  console.log(imageSend);

  // Similarity percentage (can be dynamic)
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const { data, updateData } = useContext(DataContext);

  if (data.length === 0)
    return (
      <PageWrapper>
        <p>Pas de resultat car aucune image n'a été analysée</p>
        <NavLink to="/">
          <button className="px-6 py-2 text-xs mt-4 text-white bg-teal hover:bg-navy rounded-lg shadow-md">
            Retourner a la page du choix de l'image
          </button>
        </NavLink>
      </PageWrapper>
    );
  console.log(data);
  const sorted = data.sort((a, b) => b.score - a.score);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <PageWrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-x-8 items-center justify-center">
            <div className=" mt-6 flex flex-col items-center  gap-x-4 rounded-md mb-8 mx-auto">
              <img
                src={imageSend.url}
                alt="Current Element"
                className="object-cover w-64 h-64"
              />
              <h3 className="font-bold text-teal">Image Chargee</h3>
            </div>
            <div className=" mt-6 flex flex-col items-center  gap-x-4 rounded-md mb-8 mx-auto">
              <img
                src={API_BASE_INS_URL + "/image/" + sorted[0].image_paths}
                alt="Current Element"
                className="object-cover w-64 h-64"
              />
              <h3 className="font-bold text-teal">Image la plus similaire</h3>
            </div>
          </div>

          {/* Similarity Percentage Circle */}
          <div className="w-32 h-32 mb-8 mx-auto">
            <CircularProgressbar
              value={(sorted[0].score * 100).toFixed(2)}
              text={`${(sorted[0].score * 100).toFixed(2)}%`}
              className="mx-auto"
              styles={buildStyles({
                textSize: "16px",
                pathColor: `rgba(62, 152, 199, ${sorted[0].score.toFixed(2)})`,
                textColor: "black",
                trailColor: "#d6d6d6",
                backgroundColor: "#3e98",
                margin: "0 auto",
              })}
            />
          </div>
          <div className="flex justify-center mb-4">
            <button
              onClick={() =>
                navigate(
                  `/details/${encodeURIComponent(sorted[0].image_paths)}`
                )
              }
              className="bg-teal text-md text-white px-4 py-2  rounded-lg hover:bg-teal-600 transition duration-300"
            >
              Voir les details
            </button>
          </div>
          {/* Similar Elements Section */}
          {sorted.length > 0 && (
            <div className="w-full max-w-lg my-4">
              <h3 className="text-xl text-center font-semibold text-teal mb-4">
                Autres possibilités
              </h3>
              <div className="flex flex-col space-y-4">
                {sorted.map(
                  (item, index) =>
                    index !== 0 && (
                      <div
                        key={index}
                        onClick={() =>
                          navigate(
                            `/details/${encodeURIComponent(item.image_paths)}`
                          )
                        }
                        className={`flex hover:cursor-pointer filter:blur-${
                          index / 2
                        }px items-center p-4 bg-white rounded-md shadow-md transition-all 
                ${
                  index === 0
                    ? "opacity-100"
                    : `opacity-${100 - index * 15} blur-${index}`
                }`}
                        style={{
                          //filter: `blur(${index / 2}px)`,
                          "&:hover": { opacity: 100 },
                        }}
                      >
                        <div className="w-12 h-12 bg-gray-200 overfow-hidden mr-4">
                          <img
                            src={
                              API_BASE_INS_URL + "/image/" + item.image_paths
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-500 text-sm">
                            Similarite: {(item.score * 100).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default SimilarityUI;
