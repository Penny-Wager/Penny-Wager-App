import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaDice } from "react-icons/fa";
import { BiGame } from "react-icons/bi";
import { useTheme } from "../context/ThemeContext";

export default function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`${
        isDark ? "bg-black text-gray-300" : "bg-white text-gray-800"
      } min-h-full flex items-center justify-center`}
    >
      <div className="container mx-auto px-4 py-16">
        <div
          className={`${
            isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-300"
          } border rounded-lg p-8 shadow-lg max-w-2xl mx-auto relative overflow-hidden`}
        >
          <div className="z-10 relative">
            <div className="mb-6 flex justify-center">
              <div className="bg-indigo-900 bg-opacity-50 rounded-full p-6 border-2 border-indigo-600">
                <span className="text-6xl font-bold text-white">404</span>
              </div>
            </div>

            <h1
              className={`text-3xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              } text-center`}
            >
              Page Not Found
            </h1>
            <p
              className={`${
                isDark ? "text-gray-400" : "text-gray-600"
              } mb-8 text-center max-w-md mx-auto`}
            >
              The game or page you're looking for doesn't exist or has been
              moved to another location.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <Link
                to="/"
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-200 font-medium"
              >
                <FaHome className="mr-2" />
                Back to Home
              </Link>
              <Link
                to="/games"
                className={`${
                  isDark
                    ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-gray-300"
                    : "bg-gray-200 border-gray-300 hover:bg-gray-300 text-gray-700"
                } border py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-200 font-medium`}
              >
                <FaDice className="mr-2" />
                Browse Games
              </Link>
            </div>

            <div
              className={`mt-8 pt-6 border-t ${
                isDark ? "border-zinc-800" : "border-gray-300"
              }`}
            >
              <h3
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-4 flex items-center`}
              >
                <FaDice className="text-indigo-500 mr-2" />
                Popular Games You Might Like
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {["ZEUS", "WILD PHOENIX", "GATES OF OLYMPUS"].map(
                  (game, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer"
                    >
                      <div
                        className={`${
                          isDark
                            ? "bg-zinc-900 border-zinc-800"
                            : "bg-white border-gray-300"
                        } border rounded-lg overflow-hidden shadow-lg relative`}
                      >
                        <img
                          src="/api/placeholder/100/100"
                          alt={game}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 p-2 text-white">
                          <h3 className="font-bold text-sm">{game}</h3>
                        </div>
                        <div className="absolute inset-0 bg-indigo-600 bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="bg-white text-indigo-600 font-semibold py-1 px-4 rounded-full text-sm transform scale-90 group-hover:scale-100 transition-transform duration-300">
                            PLAY
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
