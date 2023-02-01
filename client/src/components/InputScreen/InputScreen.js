import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [selectedURLIndex, setSelectedURLIndex] = useState(0);
  const [colourIds, setColourIds] = useState([]);
  const [templateIDs, setTemplateIDs] = useState([]);
  const [formatIDs, setFormatIDs] = useState([]);
  const [currImage, setCurrImage] = useState("");
  const [logo, setLogo] = useState("");

  const navigate = useNavigate();
  const handleNavigate = () => {
    setSelectedURLIndex(0);
    navigate("/input", {
      state: {
        cta: cta,
        description: description,
        headline: headline,
        body: body,
        format: format,
        selectedTemplate: templateURLs[selectedURLIndex],
        selectedURLIndex: selectedURLIndex,
        logo: logo,
        templateIDs: templateIDs,
        templateURLs: templateURLs,
        formatIDs: formatIDs,
        colourIds: colourIds,
        currImage: currImage,
      },
    });
  };

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

  const handleSetLogo = (e) => {
    setLogo(e.target.value);
    console.log(logo);
  };

  const handleClickHeadline = () => {
    const prompt = document.getElementById("headline").value;
    fetch(
      `http://127.0.0.1:8000/api/rephrasePrompt/?prompt=${prompt}`
    )
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("headline").value = data.message;
      });
  };

  const handleClickBody = () => {
    const prompt = document.getElementById("body").value;
    fetch(
      `http://127.0.0.1:8000/api/rephrasePrompt/?prompt=${prompt}`
    )
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
            <select id="Platform" className="rounded w-96 border-2 border-site-purple py-2 px-1 font-normal text-base">
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
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:bg-site-purple file:text-white file:py-3 file:border-0"
              id="file_input"
              type="file"
              onChange={handleSetLogo}
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
            onClick={() => {
              S3Bucket();
            }}
          >
            Create Posts
          </button>
        </div>
        <div id="responseScreen">
          {!isTemplateOpen ? (
            <div className="flex flex-col justify-items-center mt-56 items-center md:pr-40">
              <h1 className="text-4xl font-semibold mb-4">
                Your templates will be generated here!
              </h1>
              <h1 className="text-xl font-medium mb-4">
                Click on ‘Create Posts’, to generate templates
              </h1>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-y-5 gap-x-6 mx-6 my-20">
              {templateURLs.map((url, index) => (
                <div>
                  <h1 className="font-semibold text-3xl my-4">Generated Templates</h1>
                <div className="group relative ">
                  <img
                    src={url + `?${timestamp}`}
                    alt="Template Generated"
                    className="object-cover max-w-full max-h-full rounded-lg  group-hover:opacity-60 "
                  />
                  <svg
                    class="absolute z-0 top-36 left-24 text-white opacity-0 group-hover:opacity-100 group-hover:z-2"
                    onClick={() => {
                      handleOpenImage(url, index);
                    }}
                  >
                    <path
                      d="M26.424 5.39545C30.7793 5.38097 35.0503 6.59583 38.7459 8.90037C42.4415 11.2049 45.4118 14.5056 47.3153 18.4229C43.4071 26.4052 35.4248 31.4503 26.424 31.4503C17.4232 31.4503 9.44098 26.4052 5.53274 18.4229C7.43621 14.5056 10.4065 11.2049 14.1021 8.90037C17.7978 6.59583 22.0687 5.38097 26.424 5.39545ZM26.424 0.658203C14.5809 0.658203 4.46686 8.02463 0.369141 18.4229C4.46686 28.8212 14.5809 36.1876 26.424 36.1876C38.2671 36.1876 48.3812 28.8212 52.4789 18.4229C48.3812 8.02463 38.2671 0.658203 26.424 0.658203ZM26.424 12.5013C27.9945 12.5013 29.5007 13.1252 30.6112 14.2357C31.7217 15.3462 32.3456 16.8524 32.3456 18.4229C32.3456 19.9934 31.7217 21.4996 30.6112 22.6101C29.5007 23.7206 27.9945 24.3445 26.424 24.3445C24.8535 24.3445 23.3473 23.7206 22.2368 22.6101C21.1263 21.4996 20.5025 19.9934 20.5025 18.4229C20.5025 16.8524 21.1263 15.3462 22.2368 14.2357C23.3473 13.1252 24.8535 12.5013 26.424 12.5013ZM26.424 7.76408C20.5498 7.76408 15.7652 12.5487 15.7652 18.4229C15.7652 24.2971 20.5498 29.0817 26.424 29.0817C32.2982 29.0817 37.0828 24.2971 37.0828 18.4229C37.0828 12.5487 32.2982 7.76408 26.424 7.76408Z"
                      fill="white"
                    />
                  </svg>
                  <svg
                    class="absolute z-0 top-36 left-48 text-white opacity-0 group-hover:opacity-100 group-hover:z-2"
                    onClick={() => {
                      handleDownloadImage(url, index);
                    }}
                  >
                    <path
                      d="M5.3642 38.3726C4.06146 38.3726 2.94663 37.9091 2.0197 36.9822C1.0912 36.0537 0.626953 34.9381 0.626953 33.6354V26.5295H5.3642V33.6354H33.7877V26.5295H38.525V33.6354C38.525 34.9381 38.0615 36.0537 37.1346 36.9822C36.2061 37.9091 35.0904 38.3726 33.7877 38.3726H5.3642ZM19.576 28.8981L7.73283 17.055L11.0489 13.6205L17.2073 19.7789V0.474609H21.9446V19.7789L28.103 13.6205L31.4191 17.055L19.576 28.8981Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
              ))}
              <div>
                <button onClick={handleNavigate}>Open screen</button>
              </div>
              {modalOpen && (
                <div class="fixed z-10 pt-10  p-2  md:inset-0 backdrop-blur-sm ">
                  <div class="relative w-full ml-auto mr-auto h-[90%] max-w-4xl md:h-auto bg-white rounded-lg">
                    <div class="flex justify-between ">
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
