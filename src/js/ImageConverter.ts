import { defaultOptions } from "@saschazar/wasm-avif/options";
// import wasm_avif from "@saschazar/wasm-avif";
// import defaultOptions from "@saschazar/wasm-avif/options";
export type ImageFormats = "webp" | "jpeg" | "png" | "bmp" | "gif";
export type ImageQuality =
  | 0
  | 0.1
  | 0.2
  | 0.3
  | 0.4
  | 0.5
  | 0.6
  | 0.7
  | 0.8
  | 0.9
  | 1;

class AvifConverter {
  avifModule: any;
  defaultOptions: any;

  async init() {
    const { default: wasm_avif } = await import("@saschazar/wasm-avif");
    const { default: defaultOptions } = await import(
      "@saschazar/wasm-avif/options"
    );

    this.avifModule = await wasm_avif();
    this.defaultOptions = defaultOptions;
  }

  #toImageData(image: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return null;

    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, image.width, image.height);
  }

  async convert(image: HTMLImageElement, _quality: ImageQuality) {
    const imageData = this.#toImageData(image);
    if (!imageData) return null;

    const channels = 4; // 4 representing RGBA buffer in source array, 3 RGB
    const chroma = 3; // chroma subsampling: 1 for 4:4:4, 2 for 4:2:2, 3 for 4:2:0

    const result = this.avifModule.encode(
      imageData.data,
      image.width,
      image.height,
      channels,
      this.defaultOptions,
      chroma
    );

    if (!(result instanceof Uint8Array)) return null;

    const blob = new Blob([result], { type: "image/avif" });
    return blob;
  }

  done() {
    this.avifModule.free();
  }
}

export class ImageConverter extends EventTarget {
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D | null;

  constructor() {
    super();
    this.#canvas = document.createElement("canvas");
    this.#context = this.#canvas.getContext("2d");

    if (!this.#context) {
      throw new Error("Could not get 2d context");
    }
  }

  async #toImage(file: File) {
    const image = new Image();
    image.src = URL.createObjectURL(file);

    await new Promise((resolve) => (image.onload = resolve));

    return image;
  }

  async #toBlob(
    image: HTMLImageElement,
    type: ImageFormats,
    quality: ImageQuality
  ) {
    this.#canvas.width = image.width;
    this.#canvas.height = image.height;
    this.#context?.drawImage(image, 0, 0);

    return new Promise<Blob | null>((resolve) => {
      this.#canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        `image/${type}`,
        quality
      );
    });
  }

  #progress(value: number) {
    this.dispatchEvent(
      new CustomEvent("progress", {
        detail: { value },
      })
    );
  }

  #getName(name: string, type: string) {
    const parts = name.split(".");
    parts.pop();
    return `${parts.join(".")}.${type}`;
  }

  async #toAvif(images: HTMLImageElement[], quality: ImageQuality) {
    const converter = new AvifConverter();
    await converter.init();

    const blobs = await Promise.all(
      images.map(async (image) => {
        const blob = await converter.convert(image, quality);
        this.#progress(0.5);
        console.log(`converted to AVIF`);
        return blob;
      })
    );

    return blobs;
  }

  async convert(
    files: File[],
    type: ImageFormats,
    quality: ImageQuality
  ): Promise<(null | File)[]> {
    if (!this.#context) return [];

    const images = await Promise.all(files.map((file) => this.#toImage(file)));
    let blobs: (null | Blob)[] = [];

    console.log(images);

    if (["png", "jpeg", "webp"].includes(type)) {
      blobs = await Promise.all(
        images.map((image) => {
          const promise = this.#toBlob(image, type, quality);
          promise.then(() => this.#progress(1));
          return promise;
        })
      );
    }
    if (["avif"].includes(type)) {
      blobs = await this.#toAvif(images, quality);
    }

    return blobs.map((blob, index) =>
      blob
        ? new File([blob], this.#getName(files[index].name, type), {
            type: blob.type,
          })
        : null
    );
  }
}
