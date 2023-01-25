import React from "react";

const Navbar = () => {
  return (
    <nav class="bg-white border-gray-400 border-b-2 px-2 sm:px-4 py-4 ">
      <div class="container flex flex-wrap items-center justify-between mx-auto">
        <p class="flex items-center">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            class="h-6 mr-3 sm:h-9"
            alt="Flowbite Logo"
          />
          <span class="self-center text-xl font-bold whitespace-nowrap">
            Posty
          </span>
        </p>
        <div class=" w-full mr-10 md:block md:w-auto" id="navbar-default">
          <img src="https://flowbite.com/docs/images/logo.svg" alt="User Image" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
