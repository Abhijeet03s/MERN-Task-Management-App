import React from "react";

export default function Navbar() {
  return (
    <>
      <header className="text-[#eeeeee] shadow-sm shadow-[#f4f4f4]">
        <div className="container mx-auto flex justify-between items-center p-5 flex-col lg:flex-row">
          <a className="flex title-font font-medium items-center mb-4 md:mb-0">
            <h1 className="ml-3 text-2xl">Todo App</h1>
          </a>
          <div className="max-w-full flex items-center relative">
            <svg
              className="absolute left-4 w-4 h-4"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input
              placeholder="Search"
              type="search"
              className="w-full h-[35px] pl-10 border-2 border-solid border-transparent rounded-[4px] outline-none bg-[#f3f3f4] text-[#0d0c22] transition duration-300 transition-ease"
            />
          </div>
          <div className="flex items-center gap-4">
            <h3>Abhijeet</h3>
            <button>Login</button>
          </div>
        </div>
      </header>
    </>
  );
}
