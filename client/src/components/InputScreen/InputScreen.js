import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";

const InputScreen = () => {
  const [cta, setCta] = useState("");
  const [description, setDescription] = useState("");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [templateURLs, setTemplateURLs] = useState([]);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [timestamp, setTimeStamp] = useState(new Date().getTime());
  const [format, setFormat] = useState("1080x1080");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedURLIndex, setSelectedURLIndex] = useState("");
  const [colourIds, setColourIds] = useState([]);
  const [templateIDs, setTemplateIDs] = useState(0);
  const [formatIDs, setFormatIDs] = useState(0);
  const [currImage, setCurrImage] = useState([]);

  const handleSetFormat = (e) => {
    setFormat(e.target.value);
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

  const handleOpenImage = (url, index) => {
    setSelectedTemplate(url);
    setSelectedURLIndex(index);
    setModalOpen(true);
  };

  const handleDownloadImage = (url, index) => {
    fetch(url, {
      method: "GET",
      responseType: "blob",
      headers: {
        "Content-Disposition": "attachment",
        "Content-Type": "image/png",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `template${index}.png`;
        a.click();
      });
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleChangeColour = (index) => {
    console.log(index);
    console.log(colourIds);

    const colorID = colourIds[index];
    const templateID = templateIDs[index];
    const formatID = formatIDs[index];
    const imageURL = currImage[index];
    fetch(
      `http://127.0.0.1:8000/api/fetchOtherColor/?title=${headline}&cta=${cta}&body=${body}&formatValue=${format}&description=${description}&colorID=${colorID}&templateID=${templateID}&formatID=${formatID}&imageURL=${imageURL}`
    )
      .then((response) => response.json())
      .then((data) => {
        colourIds[index] = data.color_id;
        setTimeStamp(new Date().getTime());
        setSelectedTemplate(data.url[0]);
      });
  };

  const S3Bucket = () => {
    fetch(
      `http://127.0.0.1:8000/api/generateTemplates/?title=${headline}&cta=${cta}&body=${body}&formatValue=${format}&description=${description}`
    )
      .then((response) => response.json())
      .then((data) => {
        setColourIds(data.color_ids);
        setTemplateIDs(data.template_ids);
        setFormatIDs(data.format_ids);
        setTemplateURLs(data.urls);
        setIsTemplateOpen(true);
        setCurrImage(data.images);
        setTimeStamp(new Date().getTime());
      });
  };

  return (
    <div className="font-inter">
      <Navbar />
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
        <div id="responseScreen">
          {!isTemplateOpen ? (
            <div className="flex flex-col justify-start mt-56 items-center pr-56 h-[100%]">
              <h1 className="text-4xl font-semibold mb-4">Templates</h1>
              <h1 className="text-xl font-medium mb-4">
                Click on Create Image to see the templates
              </h1>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-y-5 gap-x-6 mx-6 my-20">
              {templateURLs.map((url, index) => (
                <div className="relative h-[320px]">
                  <img
                    src={url + `?${timestamp}`}
                    alt="Template Generated"
                    className="grouptemp object-cover max-w-full max-h-full rounded-lg hover:opacity-50"
                    onClick={() => {
                      handleOpenImage(url, index);
                    }}
                  />
                </div>
              ))}
              {modalOpen && (
                <div class="fixed z-10 pt-16  p-2  md:inset-0 backdrop-blur-sm ">
                  <div class="relative w-full ml-auto mr-auto h-[100%] max-w-4xl md:h-auto bg-white rounded-lg">
                    <div class="flex justify-between p-2 pt-4 ">
                      <h1 className="text-2xl font-semibold ml-7">Template</h1>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 cursor-pointer mr-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        onClick={handleModalClose}
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                
                      <img
                        src={selectedTemplate + `?${timestamp}`}
                        alt="Selected Template"
                        className="p-10 object-cover"
                      />
                    <div className="flex justify-between px-2 pb-5">
                      <button
                        type="button"
                        onClick={() => {
                          handleChangeColour(selectedURLIndex);
                        }}
                        class="text-white ml-10 bg-blue-700 w-48 h-16 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-md"
                      >
                        Change Colour
                      </button>
                      <button
                        type="button"
                        class="text-white bg-blue-700 mr-10 w-48 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-md"
                        onClick={() => {
                          S3Bucket();
                          handleOpenImage(
                            templateURLs[selectedURLIndex],
                            selectedURLIndex
                          );
                        }}
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputScreen;
