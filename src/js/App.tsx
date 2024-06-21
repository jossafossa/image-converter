import { useState } from "react";
import ImageConverter from "./ImageConverter.ts";
import ProgressBar from "./ProgressBar.tsx";
import { ProgressBarProps } from "./ProgressBar.tsx";

const App = () => {
  const imageConverter = new ImageConverter();

  // state
  const [progressBars, setProgressBars] = useState({});
  const [type, setTypes] = useState("png");
  const [quality, setQuality] = useState(1);
  const [files, setFiles] = useState([]);

  const downloadFile = (blob: File, fileName: string) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
  };

  const setProgressBar = (id: string, value: object) => {
    setProgressBars((prevProgressBars) => {
      const bar = prevProgressBars[id];
      return {
        ...prevProgressBars,
        [id]: {
          ...bar,
          ...value,
        },
      };
    });
  };

  // submit
  const submit = (e) => {
    e.preventDefault();

    // get files as array

    console.log(files);

    for (const file of files) {
      const conversion = imageConverter.convert(file, type, quality);
      const id: string = Math.random().toString(36).substring(7);

      let newProgressBar: ProgressBarProps = {
        name: file.name,
        value: "0",
        total: "3",
        status: "loading",
      };

      // Add progress bar
      setProgressBars((prev) => {
        return { ...prev, [id]: newProgressBar };
      });

      conversion.on("start", () => {
        setProgressBar(id, {
          value: "1",
          status: "loaded",
        });
      });

      conversion.on("loaded", () => {
        setProgressBar(id, {
          value: "2",
          status: "converting",
        });
      });

      conversion.on("converted", (convertedFile: File) => {
        setProgressBar(id, {
          value: "3",
          status: "converted",
        });
        downloadFile(convertedFile, convertedFile.name);
      });
    }
  };

  return (
    <>
      <form onSubmit={submit}>
        <div className="vstack gap-1 align-items-center">
          <div className="hstack gap-1">
            <label htmlFor="type">
              <select
                name="type"
                id="type"
                value={type}
                onChange={(e) => setTypes(e.target.value)}
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WEBP</option>
              </select>
            </label>
            <div className="vstack align-items-center">
              <label htmlFor="range">Quality</label>
              <input
                onChange={(e) => setQuality(e.target.value)}
                value={quality}
                id="range"
                type="range"
                name="quality"
                step="0.1"
                min="0"
                max="1"
                defaultValue="1"
              />
            </div>
          </div>
          <input
            type="file"
            name="files"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />
          <button>Submit</button>
        </div>
      </form>

      <div>
        {Object.entries(progressBars).map(([key, progressBar], index) => (
          <ProgressBar {...progressBar} key={index} />
        ))}
      </div>
    </>
  );
};

export default App;
