import NativeAxios from "axios";

//* async fn calls internal---------------------------------------------------------------
const pendingResponseCollection = [];
export const getUserData = async () => {
  return makeAjaxCall("USER_DATA");
};
function uuidv4() {
  return Date.now() + Math.random();
}
//client to wire web calling function
function makeAjaxCall(command) {
  const guid = uuidv4().toString();

  let resolver;
  const promise = new Promise((resolve, reject) => {
    resolver = (message) => {
      message.error ? reject(message) : resolve(message);
    };
  });

  //add the unresolved promise to array of promises
  pendingResponseCollection.push({ guid, resolver });

  //send message to Parent
  window.parent.postMessage({ command, guid, source: "cohesive" }, "*");

  return promise;
}

//* parent message handler
function responseFromMobileClient(e) {
  const response = e.data;
  if (response.source === "cohesive") {
    //find the request we should respond to
    const responseItem = pendingResponseCollection.find(
      (element) => element.guid === response.guid
    );
    //respond
    if (responseItem) responseItem.resolver(response.data);

    //remove the pending call
    if (responseItem) {
      const index = pendingResponseCollection.indexOf(responseItem);
      if (index > -1) pendingResponseCollection.splice(index, 1);
    }
  }
}

//* page sync internal---------------------------------------------------------------
const pageSyncSetup = () => {
  let previousUrl = "";
  const observer = new MutationObserver(function (mutations) {
    if (location.href !== previousUrl) {
      const message = JSON.stringify({
        source: "cohesive",
        event: "path-updated",
        data: {
          oldUrl: previousUrl,
          newUrl: location.href,
          newPath: location.pathname,
        },
      });
      previousUrl = location.href;
      //* make sure to add cross site restriction for communication
      window.parent.postMessage(message, "*");
    }
  });
  return observer;
};

//!fires on load
const init = () => {
  //* parent msg handler
  window.addEventListener("message", responseFromMobileClient);
  //* fetch/axios override
  // onLoadHandler();
  //* page sync init
  const observer = pageSyncSetup();
  const config = { subtree: true, childList: true };
  observer.observe(document, config);
};

const destroy = () => {
  //* parent msg handler
  window.removeEventListener("message", responseFromMobileClient);
};

if (typeof window !== "undefined") {
  window.addEventListener("load", init);
  window.addEventListener("unload", destroy);
}
//! axios temp
export const Axios = NativeAxios.create();
Axios.interceptors.request.use(async (config) => {
  const { JWTToken } = await getUserData();

  if (config.headers) config.headers.set("Authorization", `Bearer ${JWTToken}`);

  return config;
});
