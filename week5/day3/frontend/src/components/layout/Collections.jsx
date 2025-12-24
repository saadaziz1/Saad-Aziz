import { COLLECTIONS } from "@/constants";
import { Link } from "react-router-dom";


export default function CollectionGrid() {
 


  return (
   <>
        {COLLECTIONS.map((collection,index) => (
          <Link key={index} to='/products' className="flex flex-col gap-[18px] items-center px-0 py-[10px]">
      <div className="relative w-full aspect-square overflow-hidden">
        <img 
          alt={collection.title} 
          className="absolute inset-0 w-full h-full object-cover" 
          src={collection.img} 
        />
      </div>
      <div className="flex flex-col font-['Montserrat',sans-serif] font-medium justify-center text-[#282828] dark:text-foreground text-center tracking-[0.15px] uppercase">
        <p className="leading-[24px]">{collection.title}</p>
      </div>
    </Link>
        ))}
     </>
  );
}
