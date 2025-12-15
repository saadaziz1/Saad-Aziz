const ProductInfo = ({ product }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 font-montserrat text-[#282828] dark:text-foreground">
      {/* Steeping Instructions */}
      <div>
        <h2 className="text-3xl font-light mb-6" >
          Steeping instructions
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19V6L3 2H18V5H20C20.55 5 21.0208 5.19583 21.4125 5.5875C21.8042 5.97917 22 6.45 22 7V12C22 12.55 21.8042 13.0208 21.4125 13.4125C21.0208 13.8042 20.55 14 20 14H18V19H6ZM8 17H16V4H7L8 5.3V17ZM18 12H20V7H18V12ZM12 16H15V5H12V16ZM3 22V20H21V22H3Z" fill="currentColor"/>
            </svg>
            <div>
              <span className="font-medium" >SERVING SIZE:</span>
              <span className="text-gray-600 dark:text-foreground ml-2">2 tsp per cup, 6 tsp per pot</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 13.8C4 12.1333 4.6625 10.3208 5.9875 8.3625C7.3125 6.40417 9.31667 4.28333 12 2C13.9667 3.66667 15.5625 5.25 16.7875 6.75C18.0125 8.25 18.8917 9.675 19.425 11.025H17.25C16.7833 10.075 16.1167 9.07083 15.25 8.0125C14.3833 6.95417 13.3 5.83333 12 4.65C10.0167 6.46667 8.52083 8.14167 7.5125 9.675C6.50417 11.2083 6 12.5833 6 13.8C6 15.5833 6.56667 17.0625 7.7 18.2375C8.83333 19.4125 10.2667 20 12 20V22C9.71667 22 7.8125 21.2167 6.2875 19.65C4.7625 18.0833 4 16.1333 4 13.8Z" fill="currentColor"/>
            </svg>
            <div>
              <span className="font-medium" >WATER TEMPERATURE:</span>
              <span className="text-gray-600 dark:text-foreground ml-2">100°C</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.0001 22C10.7501 22 9.57927 21.7625 8.4876 21.2875C7.39593 20.8125 6.44593 20.1708 5.6376 19.3625C4.82926 18.5541 4.1876 17.6041 3.7126 16.5125C3.2376 15.4208 3.0001 14.25 3.0001 13C3.0001 11.75 3.2376 10.5791 3.7126 9.48748C4.1876 8.39581 4.82926 7.44581 5.6376 6.63748C6.44593 5.82914 7.39593 5.18748 8.4876 4.71248C9.57927 4.23748 10.7501 3.99998 12.0001 3.99998C13.2501 3.99998 14.4209 4.23748 15.5126 4.71248C16.6043 5.18748 17.5543 5.82914 18.3626 6.63748C19.1709 7.44581 19.8126 8.39581 20.2876 9.48748C20.7626 10.5791 21.0001 11.75 21.0001 13C21.0001 14.25 20.7626 15.4208 20.2876 16.5125C19.8126 17.6041 19.1709 18.5541 18.3626 19.3625C17.5543 20.1708 16.6043 20.8125 15.5126 21.2875C14.4209 21.7625 13.2501 22 12.0001 22Z" fill="currentColor"/>
            </svg>
            <div>
              <span className="font-medium" >STEEPING TIME:</span>
              <span className="text-gray-600 ml-2 dark:text-foreground">3 - 5 minutes</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#BC575F'}}></div>
            <div>
              <span className="font-medium" >COLOR AFTER 3 MINUTES</span>
            </div>
          </div>
        </div>
      </div>

      {/* About This Tea */}
      <div>
        <h2 className="text-3xl font-light mb-6">
          About this tea
        </h2>
        
        <div className="flex flex-wrap justify-between w-full mb-6">
          <div className="border-r border-gray-400 pr-10">
            <h4 className="font-medium mb-2" >FLAVOR</h4>
            <p className="text-gray-600 dark:text-foreground">{product?.flavor || 'Spicy'}</p>
          </div>
          <div className="border-r border-gray-400 pr-10">
            <h4 className="font-medium mb-2" >ORIGIN</h4>
            <p className="text-gray-600 dark:text-foreground">{product?.origin || 'Iran'}</p>
          </div>
          <div className="border-r border-gray-400 pr-10">
            <h4 className="font-medium mb-2" >CAFFEINE</h4>
            <p className="text-gray-600 dark:text-foreground">{product?.caffeine || 'Medium'}</p>
          </div>
          <div className="pr-4">
            <h4 className="font-medium mb-2" >ALLERGENS</h4>
            <p className="text-gray-600 dark:text-foreground">Nuts-free</p>
          </div>
          <div className="mt-8">
            <h4 className="mb-2 text-3xl font-light">Ingredient</h4>
            <p className="text-gray-600 dark:text-foreground">
              Black Ceylon tea, Green tea, Ginger root, Cloves, Black pepper, 
              Cinnamon sticks, Cardamom, Cinnamon pieces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;