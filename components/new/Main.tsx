import React from "react";
import Uploader from "./Uploader";
import Editor from "./Editor";

const Main = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
      <Uploader/>
      <Editor/>
    </div>
  );
};

export default Main;
