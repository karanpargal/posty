import React, { useState, useEffect } from "react";

const InputScreen = () => {
  const [cta, setCta] = useState("");
  const [description, setDescription] = useState("");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [templateURLs, setTemplateURLs] = useState([]);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [timesRendered, setTimesRendered] = useState(0);
  const [format, setFormat] = useState("1080x1080");

  const handleSetFormat = (e) => {
    setFormat(e.target.value);
    console.log(e.target.value);
  };

  const handleSetBody = (e) => {
    setBody(e.target.value);
  };

  const handleSetDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleSetHeadline = (e) => {
    setHeadline(e.target.value);
  };

  const handleSetCTA = (e) => {
    setCta(e.target.value);
  };

  const handleClickHeadline = () => {
    const prompt = document.getElementById("headline").value;
    fetch(`http://localhost:8000/api/rephrasePrompt/?prompt=${prompt}`)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("headline").value = data.message;
      });
  };

  const handleClickBody = () => {
    const prompt = document.getElementById("body").value;
    fetch(`http://localhost:8000/api/rephrasePrompt/?prompt=${prompt}`)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("body").value = data.message;
      });
  };

  const S3Bucket = () => {
    fetch(
      `http://127.0.0.1:8000/api/generateTemplates/?title=${headline}&cta=${cta}&description=${body}&formatValue=${format}`
    )
      .then((response) => response.json())
      .then((data) => {
        setTemplateURLs(data.urls);
        setIsTemplateOpen(true);
        setTimesRendered(timesRendered + 1);
      });
  };

  return (
    <div className="flex justify-between h-[100%]">
      <div className="justify-self-start text-xl font-medium border-r-2 px-20">
        <h1 className="font-semibold text-4xl mb-4 mt-4">Edit Input</h1>
        <div className="mb-2">
          <h1 className="mb-1.5">Social Media Platform</h1>
          <select id="Platform" className="rounded w-96">
            <option selected>Choose a platform</option>
            <option value="Instagram">Instagram</option>
            <option value="Youtube">YouTube</option>
            <option value="Twitter">Twitter</option>
            <option value="test">test</option>
          </select>
        </div>
        <div className="w-72 mb-4">
          <h1 className="mb-1.5">Dimensions</h1>
          <select
            id="format"
            className="rounded w-96"
            onChange={handleSetFormat}
          >
            <option selected>Choose a dimension</option>
            <option value="1080x1080">1080x1080</option>
            <option value="1920x1080">1920x1080</option>
            <option value="1080x1920">1080x1920</option>
            <option value="test">test</option>
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
          <h1 className="mb-2">Headline of the image</h1>
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
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-r-md"
              onClick={handleClickHeadline}
            >
              Rephrase
            </button>
          </div>
        </div>
        <div className="mb-2">
          <h1 className="mb-2">Body text of image</h1>
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
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-r-md"
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
            Upload logo
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:bg-amber-500"
            id="file_input"
            type="file"
          />
        </div>

        <div className="mb-4">
          <h1 className="mb-2">Add CTA</h1>
          <input
            type="text"
            className="border text-base font-normal w-96 h-14 rounded-md placeholder:pl-1"
            placeholder="Eg: Order Now"
            onChange={handleSetCTA}
          />
        </div>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none w-96 rounded-md"
          onClick={() => {
            S3Bucket();
          }}
        >
          Create Image
        </button>
      </div>
      <div className="justify-self-center" id="responseScreen">
        {!isTemplateOpen ? (
          <div className="flex flex-col justify-center items-center  pr-56 h-[100%]">
            <h1 className="text-4xl font-semibold mb-4">Templates</h1>
            <h1 className="text-xl font-medium mb-4">
              Click on Create Image to see the templates
            </h1>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {templateURLs.map((url) => (
              <div>
                <img
                  src={url}
                  alt="Image"
                  className="h-[180px] w-[320px]"
                  key={timesRendered}
                />
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none w-96 rounded-md"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputScreen;


