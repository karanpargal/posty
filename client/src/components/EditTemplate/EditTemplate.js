import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useLocation } from "react-router-dom";
import { Axios } from '../public/scripts/sdk-client';

const EditTemplate = () => {
  const { state } = useLocation();
  const URL = process.env.REACT_APP_API_URL;
  const [timeStamp, setTimeStamp] = useState(new Date().getTime());
  let {
    cta,
    description,
    headline,
    body,
    format,
    selectedTemplate,
    selectedURLIndex,
    logo,
    templateIDs,
    formatIDs,
    colourIds,
    currImage,
  } = state;

  const handleChangeColour = () => {
    const colorID = colourIds[selectedURLIndex];
    const templateID = templateIDs[selectedURLIndex];
    const formatID = formatIDs[selectedURLIndex];
    const imageURL = currImage[selectedURLIndex];
    Axios.get(
      `${URL}api/fetchOtherColor/?title=${headline}&cta=${cta}&body=${body}&formatValue=${format}&description=${description}&colorID=${colorID}&templateID=${templateID}&formatID=${formatID}&imageURL=${imageURL}`
    )
      .then((response) => response.json())
      .then((data) => {
        colourIds[selectedURLIndex] = data.color_id;
        setTimeStamp(new Date().getTime());
        selectedTemplate = data.url[0];
        console.log(selectedTemplate);
      });
  };

  const handleSetCTA = (e) => {
    cta = e.target.value;
  };

  const handleSetFormat = (e) => {
    format = e.target.value;
  };

  const handleSetDescription = (e) => {
    description = e.target.value;
  };

  const handleSetHeadline = (e) => {
    headline = e.target.value;
  };

  const handleSetBody = (e) => {
    body = e.target.value;
  };

  const handleClickHeadline = () => {
    const prompt = document.getElementById("headline").value;
    Axios.get(`${URL}api/rephrasePrompt/?prompt=${prompt}`)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("headline").value = data.message;
      });
  };

  const handleClickBody = () => {
    const prompt = document.getElementById("body").value;
    Axios.get(`${URL}api/rephrasePrompt/?prompt=${prompt}`)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("body").value = data.message;
      });
  };

  return (
    <div>
      <Navbar />
      <div className="flex h-[100%] font-inter">
        <div className="justify-self-start text-xl font-medium border-r-2 px-20">
          <h1 className="font-semibold text-4xl mb-4 mt-4">Edit Input</h1>
          <div className="mb-2 text-md">
            <h1 className="mb-1.5">Social Media Platform</h1>
            <select
              id="Platform"
              className="rounded w-96 border-2 border-site-purple py-2 px-1 font-normal text-base"
            >
              <option selected>Choose a platform</option>
              <option value="Instagram">Instagram</option>
              <option value="Youtube">YouTube</option>
              <option value="Twitter">Twitter</option>
            </select>
          </div>
          <div className="w-72 mb-4">
            <h1 className="mb-1.5">Dimensions</h1>
            <select
              id="format"
              className="rounded w-96 border-2 border-site-purple py-2 px-1 font-normal text-base"
              onChange={handleSetFormat}
            >
              <option selected>Choose a dimension</option>
              <option value="1080x1080">1080x1080</option>
              <option value="1920x1080">1920x1080</option>
              <option value="1080x1920">1080x1920</option>
            </select>
          </div>
          <div className="mb-2">
            <h1 className="mb-2">Description of image</h1>
            <input
              type="text"
              className="border text-base font-normal w-96 h-24 rounded-md placeholder:pl-1"
              placeholder="Eg: Candy, Cosmetics, Electronics"
              onChange={handleSetDescription}
            />
          </div>
          <div className="mb-2">
            <h1 className="mb-2">
              Headline of the image{" "}
              <span className="text-gray-500 text-sm">(optional)</span>
            </h1>
            <div className="flex w-96 h-14">
              <input
                type="text"
                className="border w-96 text-base font-normal w-96 h-14 rounded-l-md placeholder:pl-1"
                id="headline"
                placeholder="Eg. Sale Sale Sale - 50% Discount"
                onChange={handleSetHeadline}
              />
              <button
                type="button"
                class="text-white bg-site-purple focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-r-md"
                onClick={handleClickHeadline}
              >
                Rephrase
              </button>
            </div>
          </div>
          <div className="mb-2">
            <h1 className="mb-2">
              Body text of image{" "}
              <span className="text-gray-500 text-sm">(optional)</span>
            </h1>
            <div className="flex w-96 h-14">
              <input
                type="text"
                className="border w-96 text-base font-normal rounded-l-md placeholder:pl-1"
                id="body"
                placeholder="Eg. Sale! Sale! Sale!"
                onChange={handleSetBody}
              />
              <button
                type="button"
                class="text-white bg-site-purple focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-r-md"
                onClick={handleClickBody}
              >
                Rephrase
              </button>
            </div>
          </div>
          <div className="mb-2">
            <label
              class="block mb-2 font-medium text-gray-900"
              for="file_input"
            >
              Upload logo{" "}
              <span className="text-gray-500 text-sm">(optional)</span>
            </label>
            <input
              className=" w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:bg-site-purple file:text-white file:py-3 file:border-0"
              id="file_input"
              type="file"
              //   onChange={handleSetLogo}
            />
          </div>

          <div className="mb-4">
            <h1 className="mb-2">
              Add CTA <span className="text-gray-500 text-sm">(optional)</span>
            </h1>
            <input
              type="text"
              className="border text-base font-normal w-96 h-14 rounded-md placeholder:pl-1"
              placeholder="Eg: Order Now"
              onChange={handleSetCTA}
            />
          </div>
          <button
            type="button"
            className="text-white bg-site-purple focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none w-96 rounded-md"
          >
            Create Posts
          </button>
        </div>
        <div className="ml-4">
          <h1 className="font-semibold text-3xl my-4">Generated Template</h1>
          <div className="flex justify-center">
            <div className="relative rounded-md">
              <img
                src={selectedTemplate + `?${timeStamp}`}
                className="object-cover rounded-md max-w-[600px] max-h-[600px]"
              />
            </div>
            <div className="flex flex-col gap-2 ml-6">
              <button
                className="px-10 py-2 border-2 rounded-md"
                onClick={handleChangeColour}
              >
                Change Colour
              </button>
              <button className="px-10 py-2 border-2 rounded-md">
                Change Image
              </button>
              <buttton className="px-10 py-2 rounded-md bg-site-purple text-white cursor-pointer">
                Change Template
              </buttton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTemplate;
