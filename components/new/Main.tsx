import React from "react";
import Uploader from "./Uploader";
import Editor from "./Editor";

const Main = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-evenly">
      <Uploader/>
      <Editor/>
      {/* Sunbmit and other stiffs */}
    </div>
  );
};

export default Main;
