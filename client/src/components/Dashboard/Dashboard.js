import React from "react";
import Navbar from "../Navbar/Navbar";

const Dashboard = () => {
  return (
    <div className="font-inter">
      <Navbar />
        <div class="container mx-auto px-4 py-8 sm:px-8 border-b-2 ">
            <h1 className="text-2xl font-bold">Recent posts created</h1>
        </div>
        <div class="container mx-auto px-4 py-8 sm:px-8 ">
            <h1 className="text-2xl font-bold">Templates</h1>
        </div>
    </div>
  );
};

export default Dashboard;
