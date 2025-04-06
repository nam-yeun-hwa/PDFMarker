import { useRef } from "react";
import { usePdfStore } from "@/store/pdfStore";

import "@/assets/css/A.css";
import StampUploader from "@/components/StampUploader";

import FileNameDisplay from "./common/FileNameDisplay";
import FileUpload from "@/components/common/FileUpload";
import Button from "./common/Button";
import { useCanvasStore } from "@/store/canvasStore";

const StampController = () => {
  const { file, setFile } = usePdfStore();
  const { fabricCanvasRef } = useCanvasStore();

  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pdfFile = e.target.files?.[0];
    setFile(pdfFile!);
    e.target.value = "";
  };

  const handlePDFUpload = () => {
    pdfInputRef.current?.click();
  };

  const handlePDFRemove = () => {
    setFile(null);
  };

  const handleDownload = () => {
    if (!fabricCanvasRef) return;

    const objects = fabricCanvasRef.getObjects();
    objects.forEach((obj) => {
      if (obj.excludeFromExport) obj.set("visible", false); // 임시로 숨김
    });
    fabricCanvasRef.renderAll();

    const dataURL = fabricCanvasRef.toDataURL({
      format: "png",
      quality: 1.0,
      multiplier: 1, // multiplier 추가 (원본 크기)
    });

    objects.forEach((obj) => {
      if (obj.excludeFromExport) obj.set("visible", true); // 복원
    });
    fabricCanvasRef.renderAll();

    // 다운로드
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "fabric-canvas-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="A">
      <div className="top">
        <>
          <FileUpload InputRef={pdfInputRef} onChange={handlePDFChange} onClick={handlePDFUpload}>
            PDF 업로드
          </FileUpload>
          <FileNameDisplay onClick={handlePDFRemove}>{file?.name}</FileNameDisplay>
          <Button onClick={handlePDFRemove}>PDF 삭제</Button>
          <Button onClick={handleDownload}>PDF 다운로드</Button>
        </>
        <>
          <StampUploader />
        </>
      </div>
    </div>
  );
};

export default StampController;
