import React from "react";

const ImageCardSquare = () => {
  return (
    <div>
      <img
        src={props.url}
        alt="Image"
        className="h-[200px] w-[200px] rounded-lg"
      />
    </div>
  );
};

export default ImageCardSquare;
