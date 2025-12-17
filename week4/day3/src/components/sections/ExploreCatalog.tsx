import gameData from '@/data/gameData.json';

export function ExploreCatalog() {
  return (
    <div className="px-4 md:px-16 lg:px-24 py-8">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-11">
          <div className="flex w-full md:w-[610px] gap-3 overflow-x-auto scrollbar-hide rounded-md ">
            <img src='./images/hero/cataloge.jpg' alt='catalog' />
          </div>
          <div className="flex-1 w-full md:w-1/2 ">
            <h2 className="text-white text-xl md:text-2xl mb-3">Explore our Catalog</h2>
            <p className="text-[rgba(255,255,255,0.7)] text-sm md:text-base max-w-[500px]">
              Browse our catalog of over 1,000 games and discover your next favorite
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
