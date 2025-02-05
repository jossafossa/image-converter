import { InputHTMLAttributes, useId, useState } from "react";
import { Label } from "../Label";
import styles from "./Files.module.scss";
import { Button } from "../Button";
import classNames from "classnames";
import { DragArea } from "../DragArea";

type RangeProps = {
  onChange: (value: File[]) => void;
  label?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

export function Files({ name, label, onChange, ...props }: RangeProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  const id = useId();

  const handleChange = (files: File[]) => {
    setFiles(files);
    onChange(files);
  };

  document.body.addEventListener("dragover", () => setDragging(true));
  document.body.addEventListener("dragleave", () => setDragging(false));
  document.body.addEventListener("drop", () => setDragging(false));

  return (
    <div className={styles.wrapper}>
      <Label name={name} label={label}>
        <input
          className={classNames(styles.input, dragging && styles.fullscreen)}
          type="file"
          name={id}
          id={id}
          multiple
          accept="image/*"
          onChange={(e) => handleChange([...(e.target.files ?? [])])}
          {...props}
        />

        <Button>Upload</Button>
      </Label>

      {files.length > 0 && (
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}

      {dragging && <DragArea>Drop you files here</DragArea>}
    </div>
  );
}
