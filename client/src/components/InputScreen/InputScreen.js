import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Axios } from "../../scripts/sdk-client";
import FileSaver from "file-saver";
import Navbar from "../Navbar/Navbar";
import axios from "axios";

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
  const [isLoading, setIsLoading] = useState(false);
  const URL = process.env.REACT_APP_API_URL;

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
    Axios.get(`${URL}api/rephrasePrompt/?prompt=${prompt}`)
      .then((response) => response.data)
      .then((data) => {
        document.getElementById("headline").value = data.message;
      });
  };

  const handleClickBody = () => {
    const prompt = document.getElementById("body").value;
    Axios.get(`${URL}api/rephrasePrompt/?prompt=${prompt}`)
      .then((response) => response.data)
      .then((data) => {
        document.getElementById("body").value = data.message;
      });
  };

  const handleOpenImage = (url, index) => {
    setSelectedTemplate(url);
    setSelectedURLIndex(index);
    setModalOpen(true);
  };

  async function handleDownloadImage(url, index) {
    FileSaver.saveAs(url, index);
    // const response = await axios.get(url, {
    //   responseType: "text",
    // });
    // console.log(response);
    // // const fileBlob = new Blob([response.data], {
    // //   type: response.headers["content-type"],
    // // });
    // // const link = document.createElement("a");
    // // link.href = URL.createObjectURL(fileBlob);
    // // link.download = index;
    // // link.click();
  }

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
    Axios.get(
      `${URL}api/fetchOtherColor/?title=${headline}&cta=${cta}&body=${body}&formatValue=${format}&description=${description}&colorID=${colorID}&templateID=${templateID}&formatID=${formatID}&imageURL=${imageURL}`
    )
      .then((response) => response.data)
      .then((data) => {
        colourIds[index] = data.color_id;
        setTimeStamp(new Date().getTime());
        setSelectedTemplate(data.url[0]);
      });
  };

  const S3Bucket = () => {
    setIsLoading(true);
    Axios.get(
      `${URL}api/generateTemplates/?title=${headline}&cta=${cta}&body=${body}&formatValue=${format}&description=${description}`
    )
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setColourIds(data.color_ids);
        setTemplateIDs(data.template_ids);
        setFormatIDs(data.format_ids);
        setTemplateURLs(data.urls);
        setIsTemplateOpen(true);
        setCurrImage(data.images);
        setTimeStamp(new Date().getTime());
        setIsLoading(false);
      });
  };

  return (
    <div className="font-inter">
      {/* <Navbar /> */}
      <div className="grid grid-flow-col h-[100%] auto-cols-max gap-auto">
        <div className="justify-self-start font-medium border-r-2 pl-[39px] pr-[23px]">
          <h1 className="font-semibold text-[30px] mb-3.5 mt-4">
            BannerBuilder
          </h1>
          <div className="">
            <h1 className="mb-2.5 text-[16px] font-semibold">Platform</h1>
            <select
              id="Platform"
              className="rounded-lg w-96 border-2 border-site-purple py-2 px-1 font-normal text-base mb-4"
            >
              <option selected>Choose a platform</option>
              <option value="Instagram">Instagram</option>
              <option value="Youtube">YouTube</option>
              <option value="Twitter">Twitter</option>
            </select>
          </div>
          <div className="w-72 mb-4">
            <h1 className="mb-2.5 text-[16px] font-semibold">
              Dimensions<span className="text-red-500 text-lg">*</span>
            </h1>
            <select
              id="format"
              className="rounded-lg w-96 border-2 border-site-purple py-2 px-1 font-normal text-base"
              onChange={handleSetFormat}
            >
              <option selected>Choose a dimension</option>
              <option value="1080x1080">Square(1:1)</option>
              <option value="1920x1080">Banner(16:9)</option>
              <option value="1080x1920">Story(9:16)</option>
            </select>
          </div>
          <div className="mb-4">
            <h1 className="mb-2.5 text-[16px] font-semibold">
              Keywords<span className="text-red-500 text-lg">*</span>
            </h1>
            <input
              type="text"
              className="border text-base font-normal w-96 h-24 rounded-lg pl-1 placeholder:pl-1 placeholder:text-[16px]"
              placeholder="Eg: Candy, Cosmetics, Electronics"
              onChange={handleSetDescription}
            />
          </div>
          <div className="mb-4">
            <h1 className="mb-2.5 text-[16px] font-semibold">
              Heading<span className="text-red-500 text-lg">*</span>
            </h1>
            <div className="flex w-96 h-14">
              <input
                type="text"
                className="border w-96 text-base font-normal w-96 h-14 rounded-l-lg pl-1 placeholder:pl-1 placeholder:text-[16px]"
                id="headline"
                maxLength="20"
                placeholder="Eg. Special Offer!"
                onChange={handleSetHeadline}
              />
              <button
                type="button"
                class="text-white bg-site-purple focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-r-lg"
                onClick={handleClickHeadline}
              >
                Rephrase
              </button>
            </div>
          </div>
          <div className="mb-4">
            <h1 className="mb-2.5  text-[16px] font-semibold">Body</h1>
            <div className="w-96">
              <textarea
                type="text"
                class="w-96 p-2.5 resize-none border rounded-lg mb-1.5"
                id="body"
                rows="5"
                maxLength="40"
                placeholder="Eg. Discount of 30% on all our products on the occasion of Christmas!"
                onChange={handleSetBody}
              />
              <button
                type="button"
                class="text-white w-96 bg-site-purple focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-lg"
                onClick={handleClickBody}
              >
                Rephrase Body
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label
              class="block mb-2.5 font-medium text-gray-900 text-[16px] font-semibold"
              for="file_input"
            >
              Logo
            </label>
            <input
              className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:bg-site-purple file:text-white file:py-3 file:rounded-r-lg file:border-0 file:mr-0 file:float-right"
              id="file_input"
              type="file"
              onChange={handleSetLogo}
            />
          </div>

          <div className="mb-5">
            <h1 className="mb-2.5 text-[16px] font-semibold">CTA</h1>
            <input
              type="text"
              className="border text-base font-normal w-96 h-14 rounded-lg pl-1 placeholder:pl-1 placeholder:text-[16px]"
              placeholder="Eg: Order Now"
              maxLength="14"
              onChange={handleSetCTA}
            />
          </div>
          <button
            type="button"
            className="text-white bg-site-purple focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none w-96 rounded-lg"
            onClick={() => {
              S3Bucket();
            }}
          >
            Create Posts
          </button>
        </div>
        {isLoading ? (
          <div className="mt-80 text-4xl font-semibold">
            <svg
              aria-hidden="true"
              class="inline w-10 h-10 ml-10 text-gray-200 animate-spin dark:text-gray-600 fill-site-purple"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        ) : (
          <div id="responseScreen" className="justify-self-center">
            {!isTemplateOpen ? (
              <div className="grid grid-cols-1 mt-56 justify-items-center ml-96">
                <h1 className="text-4xl font-semibold mb-4">
                  Your templates will be generated here!
                </h1>
                <h1 className="text-xl font-medium mb-4">
                  Click on ‘Create Posts’, to generate templates
                </h1>
              </div>
            ) : (
              <div>
                <h1 className="font-semibold text-3xl my-4">
                  Generated Templates
                </h1>
                <div className="grid grid-cols-3 gap-y-5 gap-x-6 ml-4 mr-6">
                  {templateURLs.map((url, index) => (
                    <div>
                      <div className="group relative">
                        <svg
                          class="absolute z-0 block mt-[50%] ml-[30%] text-white opacity-0 group-hover:opacity-100 group-hover:z-2"
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
                          class="absolute block z-0 mt-[50%] ml-[60%] text-white opacity-0 group-hover:opacity-100 group-hover:z-2"
                          onClick={() => {
                            handleDownloadImage(url, index);
                          }}
                        >
                          <path
                            d="M5.3642 38.3726C4.06146 38.3726 2.94663 37.9091 2.0197 36.9822C1.0912 36.0537 0.626953 34.9381 0.626953 33.6354V26.5295H5.3642V33.6354H33.7877V26.5295H38.525V33.6354C38.525 34.9381 38.0615 36.0537 37.1346 36.9822C36.2061 37.9091 35.0904 38.3726 33.7877 38.3726H5.3642ZM19.576 28.8981L7.73283 17.055L11.0489 13.6205L17.2073 19.7789V0.474609H21.9446V19.7789L28.103 13.6205L31.4191 17.055L19.576 28.8981Z"
                            fill="white"
                          />
                        </svg>
                        <img
                          src={url + `?${timestamp}`}
                          alt="Template Generated"
                          className="object-cover max-w-[400px] max-h-[400px] rounded-lg  group-hover:opacity-60 "
                        />
                      </div>
                    </div>
                  ))}
                  {modalOpen && (
                    <div class="fixed z-10 pt-10  p-2  md:inset-0 backdrop-blur-sm ">
                      <div class="relative w-full ml-auto mr-auto h-[90%] max-w-4xl md:h-auto bg-white rounded-lg">
                        <div class="flex justify-between ">
                          <h1 className="text-2xl font-semibold ml-7">
                            Template
                          </h1>
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
                          className="p-10 object-cover max-h-[80%]"
                        />
                        <div className="flex justify-between px-2 pb-5">
                          <button
                            type="button"
                            onClick={() => {
                              handleChangeColour(selectedURLIndex);
                            }}
                            class="text-white ml-10 bg-site-purple w-48 h-16  font-medium text-sm px-5 py-2.5 focus:outline-none rounded-lg"
                          >
                            Change Colour
                          </button>
                          <button
                            type="button"
                            class="text-white bg-site-purple mr-10 w-48 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-lg"
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputScreen;
