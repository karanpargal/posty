import React from "react";
import Navbar from "../Navbar/Navbar";
import { useLocation } from "react-router-dom";

const EditTemplate = () => {
  const { state } = useLocation();
    console.log(state);
//   const {
//     cta,
//     description,
//     headline,
//     body,
//     format,
//     selectedTemplate,
//     selectedURLIndex,
//     logo,
//     templateIDs,
//     formatIDs,
//     colourIds,
//   } = state;

  return (
    <div>
      <Navbar />
      <div className="flex h-[100%]">
        <div className="justify-self-start text-xl font-medium border-r-2 px-20">
          <h1 className="font-semibold text-4xl mb-4 mt-4">Edit Input</h1>
          <div className="mb-2">
            <h1 className="mb-1.5">Social Media Platform</h1>
            <select id="Platform" className="rounded w-96">
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
              className="rounded w-96"
            //   onChange={handleSetFormat}
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
            //   onChange={handleSetDescription}
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
                // onChange={handleSetHeadline}
              />
              <button
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-r-md"
                // onClick={handleClickHeadline}
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
                // onChange={handleSetBody}
              />
              <button
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-r-md"
                // onClick={handleClickBody}
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
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:bg-amber-500"
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
            //   onChange={handleSetCTA}
            />
          </div>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none w-96 rounded-md"
          >
            Create Posts
          </button>
        </div>
        <div className="ml-4">
            <h1 className="font-semibold text-3xl my-4">Generated Template</h1>
            <div className="flex justify-center">
                <div className="w-[600px] h-[600px] border-2 border-gray-300 rounded-md">
                    Image will be displayed here
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditTemplate;
