import { useState } from "react";
import {
  ImageConverter,
  ImageFormats,
  type ImageQuality,
} from "./ImageConverter.ts";
import { ProgressBar } from "./components/ProgressBar";
import { DownloadFiles } from "./components/DownloadFiles";
import { Select } from "./components/Select";
import { Range } from "./components/Range";
import { Files } from "./components/Files";
import { Button } from "./components/Button";
import { Stack } from "./components/Stack/Stack.tsx";

const App = () => {
  const imageConverter = new ImageConverter();
  const [progress, setProgress] = useState<number>(0);
  const [convertedFiles, setConvertedFiles] = useState<File[] | null>(null);
  const [type, setType] = useState<ImageFormats>("png");
  const [quality, setQuality] = useState<ImageQuality>(1);
  const [files, setFiles] = useState<File[]>([]);
  const isConverting = convertedFiles && convertedFiles.length !== files.length;
  const isDownloadable =
    convertedFiles &&
    convertedFiles.length > 0 &&
    convertedFiles.length === files.length;

  const convert = () => {
    setConvertedFiles([]);
    setProgress(0);

    imageConverter.addEventListener("progress", (e) => {
      setProgress((progress) => (progress += e.detail.value));
    });
    imageConverter.convert(files, type, quality).then((blobs) => {
      // filter out empty values
      let filteredBlobs = blobs.filter((blob) => blob !== null) as File[];
      if (filteredBlobs) {
        setConvertedFiles(filteredBlobs);
      }
    });
  };

  const types = [
    { value: "png", label: "PNG" },
    { value: "jpeg", label: "JPG" },
    { value: "webp", label: "WEBP" },
    { value: "avif", label: "AVIF" },
  ] as {
    value: ImageFormats;
    label: string;
  }[];

  return (
    <Stack vertical>
      <Select
        label="Type"
        name="type"
        value={type}
        options={types}
        onChange={setType}
      />
      <Range
        value={quality}
        onChange={setQuality}
        step="0.1"
        min="0"
        max="1"
        label="Quality"
      />
      <Files label="Files" onChange={setFiles} />

      {files.length > 0 && <Button onClick={convert}>Convert</Button>}

      {(isConverting || isDownloadable) && (
        <ProgressBar value={progress} total={files.length} />
      )}

      {isDownloadable && <DownloadFiles files={convertedFiles as File[]} />}
    </Stack>
  );
};

export default App;
