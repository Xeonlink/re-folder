import { nativeImage } from "electron";
import icon1024_black from "../../resources/icon1024_black.png?asset";

type SizeOptions = Required<Electron.ResizeOptions>;

function createTemplateNativeImage(path: string, sizeOptions: SizeOptions) {
  const quality = sizeOptions.quality;
  const image = nativeImage.createEmpty();
  image.setTemplateImage(true);

  const scales = [1, 1.25, 1.33, 1.4, 1.5, 1.8, 2, 2.5, 3, 4, 5];
  for (const scaleFactor of scales) {
    const width = Math.round(sizeOptions.width * scaleFactor);
    const height = Math.round(sizeOptions.height * scaleFactor);
    const icon = nativeImage.createFromPath(path).resize({ width, height, quality });
    icon.setTemplateImage(true);
    const buffer = icon.toPNG();
    image.addRepresentation({ scaleFactor, width, height, buffer });
  }

  return image;
}

export const mac = {
  tray: createTemplateNativeImage(icon1024_black, {
    width: 22,
    height: 22,
    quality: "best"
  })
};
