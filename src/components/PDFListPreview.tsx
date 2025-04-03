import { useEffect, useState } from "react";
import { useStore } from "@/store/store";

import "@/assets/css/C.css";
import { getImageByFile } from "../utils/utils";

const PDFListPreview = () => {
  const { file } = useStore();
  const [fileImage, setFileImage] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    (async () => {
      setFileImage((await getImageByFile(file)) ?? "");
    })();
  }, [file]);

  return (
    <div className="C">
      <div className="top">
        {fileImage && (
          <div>
            <div className="image">
              <img src={fileImage} />
            </div>
            <div className="imageIndex">1</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFListPreview;
