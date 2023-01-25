import React from "react";

const ImageCardLandscape = (props) => {
  return (
    <div>
      <img
        src={props.url}
        alt="Image"
        className="h-[180px] w-[320px] rounded-lg"
      />
    </div>
  );
};

export default ImageCardLandscape;
