import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { NAVLINKS } from "@/constants";
import { MenuIcon, Settings, X } from "lucide-react";
import useToggle from "@/hooks/useToggle";
import LightDarkButton from "../common/LightDarkButton";
import useAuthStore from "@/store/authStore";
import { useCart } from "@/hooks/useCart";
import { Cart } from "@/pages/cart/Cart";
import Notifications from "./Notifications";

const Navbar = () => {
  const { toggle, handleToggle } = useToggle();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { data: cartData } = useCart();
  
  const cartItemCount = cartData?.cart?.items?.length || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleNavClick = (link) => {
    navigate(link);
    handleToggle(); // close menu after click
  };

  return (
    <header className="border-b border-border top-0 bg-background z-30 relative ">
      <div className="container mx-auto px-0 py-4 flex items-center justify-between">
        
        <button
          onClick={() => navigate("/")}
          className="text-xl font-normal tracking-[0.1px] flex items-center justify-center gap-2 font-prosto-one"
        >
          
          <span>
            
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              
              <path
                d="M16 36V20.05C13.8667 20.05 11.8167 19.6413 9.85 18.824C7.88333 18.008 6.15 16.85 4.65 15.35C3.15 13.85 2 12.1167 1.2 10.15C0.4 8.18333 0 6.13333 0 4V0H4C6.1 0 8.13333 0.408 10.1 1.224C12.0667 2.04133 13.8 3.2 15.3 4.7C16.3333 5.73333 17.192 6.86667 17.876 8.1C18.5587 9.33333 19.0833 10.65 19.45 12.05C19.6167 11.8167 19.8 11.592 20 11.376C20.2 11.1587 20.4167 10.9333 20.65 10.7C22.15 9.2 23.8833 8.04133 25.85 7.224C27.8167 6.408 29.8667 6 32 6H36V10C36 12.1333 35.592 14.1833 34.776 16.15C33.9587 18.1167 32.8 19.85 31.3 21.35C29.8 22.85 28.0747 24 26.124 24.8C24.1747 25.6 22.1333 26 20 26V36H16Z"
                fill="currentColor"
              />
            </svg>
          </span>
          ATELIER
        </button>
        <nav className="hidden lg:flex items-center gap-8 font-montserrat text-sm font-medium tracking-[0.1px] leading-5">
          
          {NAVLINKS.map((link, index) => (
            <button
              key={index}
              onClick={() => navigate('/products')}
              className="text-sm hover:text-muted-foreground transition-colors"
            >
              
              {link.TEXT}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3 justify-end">
          <LightDarkButton />
<div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.146 12.371 1.888 11.113C0.629333 9.85433 0 8.31667 0 6.5C0 4.68333 0.629333 3.14567 1.888 1.887C3.146 0.629 4.68333 0 6.5 0C8.31667 0 9.85433 0.629 11.113 1.887C12.371 3.14567 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.81267 10.5627 9.688 9.688C10.5627 8.81267 11 7.75 11 6.5C11 5.25 10.5627 4.18733 9.688 3.312C8.81267 2.43733 7.75 2 6.5 2C5.25 2 4.18733 2.43733 3.312 3.312C2.43733 4.18733 2 5.25 2 6.5C2 7.75 2.43733 8.81267 3.312 9.688C4.18733 10.5627 5.25 11 6.5 11Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded shadow-lg z-50">
                <form onSubmit={handleSearch} className="flex items-center p-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600 w-64"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="ml-2 px-2 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </form>
              </div>
            )}
          </div>
          {isAuthenticated() ? (
            <div className="flex items-center gap-2">
              <Notifications />
              {user && (
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.146 12.1123 0.438 11.637C0.729334 11.1623 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64567 4.75 9.387C5.81667 9.129 6.9 9 8 9C9.1 9 10.1833 9.129 11.25 9.387C12.3167 9.64567 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2707 11.1623 15.562 11.637C15.854 12.1123 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9543 12.85 13.863 12.7C13.771 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5623 10.775 11.337C9.85833 11.1123 8.93333 11 8 11C7.06667 11 6.14167 11.1123 5.225 11.337C4.30833 11.5623 3.4 11.9 2.5 12.35C2.35 12.4333 2.22933 12.55 2.138 12.7C2.046 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.021 5.804 9.413 5.412C9.80433 5.02067 10 4.55 10 4C10 3.45 9.80433 2.97933 9.413 2.588C9.021 2.196 8.55 2 8 2C7.45 2 6.97933 2.196 6.588 2.588C6.196 2.97933 6 3.45 6 4C6 4.55 6.196 5.02067 6.588 5.412C6.97933 5.804 7.45 6 8 6Z" fill="currentColor"/>
</svg>
                  </Button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-white dark:bg-background border border-gray-300 rounded shadow-lg z-50 min-w-48">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          Profile
                        </button>
                        {(user.role === 'admin' || user.role === 'superadmin') && (
                          <button
                            onClick={() => {
                              navigate('/admin');
                              setUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              if (isAuthenticated()) {
                setCartOpen(true);
              } else {
                navigate('/login');
              }
            }}
            className="relative"
          >
            <svg
              width="18"
              height="21"
              viewBox="0 0 18 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 21C1.45 21 0.979 20.8043 0.587 20.413C0.195667 20.021 0 19.55 0 19V7C0 6.45 0.195667 5.97933 0.587 5.588C0.979 5.196 1.45 5 2 5H4C4 3.61667 4.48767 2.43733 5.463 1.462C6.43767 0.487333 7.61667 0 9 0C10.3833 0 11.5627 0.487333 12.538 1.462C13.5127 2.43733 14 3.61667 14 5H16C16.55 5 17.021 5.196 17.413 5.588C17.8043 5.97933 18 6.45 18 7V19C18 19.55 17.8043 20.021 17.413 20.413C17.021 20.8043 16.55 21 16 21H2ZM2 19H16V7H2V19ZM9 13C10.3833 13 11.5627 12.5123 12.538 11.537C13.5127 10.5623 14 9.38333 14 8H12C12 8.83333 11.7083 9.54167 11.125 10.125C10.5417 10.7083 9.83333 11 9 11C8.16667 11 7.45833 10.7083 6.875 10.125C6.29167 9.54167 6 8.83333 6 8H4C4 9.38333 4.48767 10.5623 5.463 11.537C6.43767 12.5123 7.61667 13 9 13ZM6 5H12C12 4.16667 11.7083 3.45833 11.125 2.875C10.5417 2.29167 9.83333 2 9 2C8.16667 2 7.45833 2.29167 6.875 2.875C6.29167 3.45833 6 4.16667 6 5Z"
                fill="currentColor"
              />
            </svg>
            {isAuthenticated() && cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>
        {isAuthenticated() && (
          <Cart 
            isOpen={cartOpen} 
            onClose={() => setCartOpen(false)} 
          />
        )}
      
        
        {/* MOBILE MENU BUTTON AND NOTIFICATIONS */}
        <div className="flex items-center gap-2 lg:hidden">
          {isAuthenticated() && <Notifications />}
          <Button
            className="block lg:hidden"
            variant="ghost"
            
            onClick={handleToggle}
          >
            {!toggle ? <MenuIcon   /> : <X />}
          </Button>
        </div>
      </div>
  </div>
  
      {/* BACKDROP */}
      {toggle && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={handleToggle}
        />
      )}

      {/* SLIDE-IN MOBILE NAV */}
   <div
  className={`fixed top-0 right-0 h-full w-72 z-50 transform transition-transform duration-300 lg:hidden
    ${toggle ? "translate-x-0" : "translate-x-full"}
    bg-background text-foreground border-l border-border`}
>
        <div className="p-6 flex flex-col gap-6">
          <div className="flex justify-end">
            <Button variant="ghost"  onClick={handleToggle}>
              <X size={45} />
            </Button>
          </div>
<div className="flex  gap-3 mt-6 ">
            <div className="flex border">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.146 12.371 1.888 11.113C0.629333 9.85433 0 8.31667 0 6.5C0 4.68333 0.629333 3.14567 1.888 1.887C3.146 0.629 4.68333 0 6.5 0C8.31667 0 9.85433 0.629 11.113 1.887C12.371 3.14567 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.81267 10.5627 9.688 9.688C10.5627 8.81267 11 7.75 11 6.5C11 5.25 10.5627 4.18733 9.688 3.312C8.81267 2.43733 7.75 2 6.5 2C5.25 2 4.18733 2.43733 3.312 3.312C2.43733 4.18733 2 5.25 2 6.5C2 7.75 2.43733 8.81267 3.312 9.688C4.18733 10.5627 5.25 11 6.5 11Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
              
                
                  <form onSubmit={handleSearch} className="flex items-center p-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="   focus:outline-none focus:border-gray-600 "
                      autoFocus
                    />
                    
                  </form>
                
            
              

            </div>


         
          </div>
          
          <div className="pb-6 flex flex-col border-b gap-2 justify-start items-start font-montserrat text-lg font-bold">
 {isAuthenticated() ? (
            <div className="flex flex-col gap-2">
              
              {(user?.role === 'admin' || user?.role === 'superadmin') ? (
                <div className="flex flex-col gap-2 justify-start items-start">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleToggle();
                    navigate('/admin');
                  }}
                >
                 <Settings />
<div className="flex flex-col ml-2 items-start justify-start">
  <span  >Dashboard</span>
  <span className="font-normal text-sm text-gray-400 dark:text-foreground"> welcome to the dashboard</span>
</div>


                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleToggle();
                    navigate('/profile');
                  }}
                >
                 <svg width="26" height="26" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.146 12.1123 0.438 11.637C0.729334 11.1623 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64567 4.75 9.387C5.81667 9.129 6.9 9 8 9C9.1 9 10.1833 9.129 11.25 9.387C12.3167 9.64567 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2707 11.1623 15.562 11.637C15.854 12.1123 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9543 12.85 13.863 12.7C13.771 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5623 10.775 11.337C9.85833 11.1123 8.93333 11 8 11C7.06667 11 6.14167 11.1123 5.225 11.337C4.30833 11.5623 3.4 11.9 2.5 12.35C2.35 12.4333 2.22933 12.55 2.138 12.7C2.046 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.021 5.804 9.413 5.412C9.80433 5.02067 10 4.55 10 4C10 3.45 9.80433 2.97933 9.413 2.588C9.021 2.196 8.55 2 8 2C7.45 2 6.97933 2.196 6.588 2.588C6.196 2.97933 6 3.45 6 4C6 4.55 6.196 5.02067 6.588 5.412C6.97933 5.804 7.45 6 8 6Z" fill="black"/>
</svg>
<div className="flex flex-col ml-2 items-start justify-start">
  <span  >Profile</span>
  <span className="font-normal text-sm text-gray-400 dark:text-foreground"> We Know You as {user.role}</span>
</div>


                </Button></div>)
                : <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleToggle();
                    navigate('/profile');
                  }}
                >
                 <svg width="26" height="26" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.146 12.1123 0.438 11.637C0.729334 11.1623 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64567 4.75 9.387C5.81667 9.129 6.9 9 8 9C9.1 9 10.1833 9.129 11.25 9.387C12.3167 9.64567 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2707 11.1623 15.562 11.637C15.854 12.1123 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9543 12.85 13.863 12.7C13.771 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5623 10.775 11.337C9.85833 11.1123 8.93333 11 8 11C7.06667 11 6.14167 11.1123 5.225 11.337C4.30833 11.5623 3.4 11.9 2.5 12.35C2.35 12.4333 2.22933 12.55 2.138 12.7C2.046 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.021 5.804 9.413 5.412C9.80433 5.02067 10 4.55 10 4C10 3.45 9.80433 2.97933 9.413 2.588C9.021 2.196 8.55 2 8 2C7.45 2 6.97933 2.196 6.588 2.588C6.196 2.97933 6 3.45 6 4C6 4.55 6.196 5.02067 6.588 5.412C6.97933 5.804 7.45 6 8 6Z" fill="black"/>
</svg>
<div className="flex flex-col ml-2 items-start justify-start">
  <span  >Profile</span>
  <span className="font-normal text-sm text-gray-400 dark:text-foreground"> We Know You as {user.role}</span>
</div>


                </Button>
              }
              
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          )}
          <div className="flex items-start justify-start">
<Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              handleToggle();
              if (isAuthenticated()) {
                setCartOpen(true);
              } else {
                navigate('/login');
              }
            }}
            className="relative"
          >
            <svg
              width="18"
              height="21"
              viewBox="0 0 18 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 21C1.45 21 0.979 20.8043 0.587 20.413C0.195667 20.021 0 19.55 0 19V7C0 6.45 0.195667 5.97933 0.587 5.588C0.979 5.196 1.45 5 2 5H4C4 3.61667 4.48767 2.43733 5.463 1.462C6.43767 0.487333 7.61667 0 9 0C10.3833 0 11.5627 0.487333 12.538 1.462C13.5127 2.43733 14 3.61667 14 5H16C16.55 5 17.021 5.196 17.413 5.588C17.8043 5.97933 18 6.45 18 7V19C18 19.55 17.8043 20.021 17.413 20.413C17.021 20.8043 16.55 21 16 21H2ZM2 19H16V7H2V19ZM9 13C10.3833 13 11.5627 12.5123 12.538 11.537C13.5127 10.5623 14 9.38333 14 8H12C12 8.83333 11.7083 9.54167 11.125 10.125C10.5417 10.7083 9.83333 11 9 11C8.16667 11 7.45833 10.7083 6.875 10.125C6.29167 9.54167 6 8.83333 6 8H4C4 9.38333 4.48767 10.5623 5.463 11.537C6.43767 12.5123 7.61667 13 9 13ZM6 5H12C12 4.16667 11.7083 3.45833 11.125 2.875C10.5417 2.29167 9.83333 2 9 2C8.16667 2 7.45833 2.29167 6.875 2.875C6.29167 3.45833 6 4.16667 6 5Z"
                fill="currentColor"
              />
            </svg>
            <div className="flex flex-col ml-2 items-start justify-start">
  <span  >Your Bag</span>
  {isAuthenticated() && cartItemCount > 0 && (
  <span className="font-normal text-sm text-gray-400 dark:text-foreground"> <span className="text-yellow-800">{cartItemCount}</span> products added in your bag</span>
              
            )}
</div>
          
            
          </Button>
          </div>
          
          </div>

          <nav className="flex flex-col gap-4 font-montserrat text-sm font-medium">
            {NAVLINKS.map((link, index) => (
              <button
                key={index}
                onClick={() => handleNavClick('/products')}
                className="text-left hover:text-muted-foreground transition-colors"
              >
                {link.TEXT}
              </button>
            ))}
            
          </nav>

          
        </div>
      </div>
    </header>
  );
};

export default Navbar;