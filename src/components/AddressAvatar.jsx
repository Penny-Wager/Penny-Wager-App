import React from "react";

export default function AddressAvatar({ address, size = "md" }) {
  const getColorFromAddress = (address) => {
    if (!address) return { from: "#6366f1", to: "#4f46e5" }; // fallback indigo shades

    // Hash parts of address to get RGB values
    const hash = address.slice(2); // remove "0x"
    const r1 = parseInt(hash.slice(0, 2), 16);
    const g1 = parseInt(hash.slice(2, 4), 16);
    const b1 = parseInt(hash.slice(4, 6), 16);
    const r2 = parseInt(hash.slice(-6, -4), 16);
    const g2 = parseInt(hash.slice(-4, -2), 16);
    const b2 = parseInt(hash.slice(-2), 16);

    const from = `rgb(${r1}, ${g1}, ${b1})`;
    const to = `rgb(${r2}, ${g2}, ${b2})`;

    return { from, to };
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case "xs":
        return "h-8 w-8 text-xs";
      case "sm":
        return "h-12 w-12 text-base";
      case "md":
        return "h-16 w-16 text-2xl";
      case "lg":
        return "h-20 w-20 text-3xl";
      case "xl":
        return "h-24 w-24 text-4xl";
      default:
        return "h-16 w-16 text-2xl";
    }
  };

  const { from, to } = getColorFromAddress(address);
  const sizeClasses = getSizeClasses(size);
  const initials = address ? address.slice(2, 4).toUpperCase() : "??";

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold ${sizeClasses}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {initials}
    </div>
  );
}
