const Breadcrumb = ({ path = "HOME/COLLECTIONS/CHAI" }) => {
  return (
    <div className="py-4 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs sm:text-sm text-[#282828] dark:text-foreground truncate font-montserrat" >
          {path}
        </p>
      </div>
    </div>
  );
};

export default Breadcrumb;