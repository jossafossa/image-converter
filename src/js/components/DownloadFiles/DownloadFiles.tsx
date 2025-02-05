import JSZip from "jszip";
import { memo } from "react";
import { Button } from "../Button";

type DownloadFilesProps = {
  files: File[];
};
export const DownloadFiles = memo(({ files }: DownloadFilesProps) => {
  const download = (blob: Blob, name: string) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
  };

  const handleDownload = async () => {
    const [file, name] =
      files.length === 1
        ? [files[0], files[0].name]
        : [await zip(), "files.zip"];

    download(file, name);
  };

  const zip = async () => {
    const zip = new JSZip();
    for (const file of files) {
      zip.file(file.name, file);
    }

    return await zip.generateAsync({ type: "blob" });
  };

  return (
    <div>
      <Button onClick={handleDownload}>Download</Button>
    </div>
  );
});
