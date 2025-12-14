import { COLLECTIONS } from "@/constants";
import { useEffect, useState } from "react";

export default function CollectionGrid() {
 


  return (
    <div className=" text-center">
      <h2 className="text-xl font-bold mb-4">Our Collections</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((collection,index) => (
          <div
            key={index}
            
          >
            <img
              src={collection.img}
              alt={collection.title}
              className="lg:w-90 lg:h-90 w-43 h-43 object-cover mb-2"
            />
            <h3 className="font-semibold">{collection.title}</h3>
            
          </div>
        ))}
      </div>
    </div>
  );
}
