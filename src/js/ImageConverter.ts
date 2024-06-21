class EventHandler {
  events: {[key: string]: Function[]};
  constructor() {
    this.events = {};
  }

  on(event: string, callback: Function) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(callback);
  }

  trigger(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback(...args);
      });
    }
  }
}

class ConversionObject extends EventHandler {
  convert(file: File, type: String, quality: Number = 0.9): void {
    window.requestAnimationFrame(() => {
      this.trigger('start');
      // Convert file into image
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        this.trigger('loaded');

        // Create canvas and draw image
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext("2d")?.drawImage(image, 0, 0);
        // Convert image to webp
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Remove extension from file name
              const fullFileName = file.name;
              const fileName = fullFileName.split('.').slice(0, -1).join('.');
              // Create converted file
              const convertedFile = new File([blob], `${fileName}.${type}`);
              this.trigger('converted', convertedFile);
            } else {
              this.trigger("error", "blob is null");
            }
          },
          `image/${type}`,
          quality
        );
      };
    });
  }
}


export default class imageConverter {
  convert(file: File, type: String, quality: Number = 0.9): ConversionObject {
    let convertionObject = new ConversionObject();
    convertionObject.convert(file, type, quality);
    return convertionObject;
  }
}