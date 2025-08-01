import { createImage, getRadianAngle } from './imageUtils';

export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const rad = getRadianAngle(rotation);

  // Создаём безопасное поле
  const safeArea = Math.max(image.width, image.height) * 2;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = safeArea;
  tempCanvas.height = safeArea;
  const tempCtx = tempCanvas.getContext('2d');

  // Центрируем, вращаем и рисуем
  tempCtx.translate(safeArea / 2, safeArea / 2);
  tempCtx.rotate(rad);
  tempCtx.translate(-image.width / 2, -image.height / 2);
  tempCtx.drawImage(image, 0, 0);

  // Вырезаем область crop
  const data = tempCtx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error('Не удалось создать изображение'));
      resolve(blob);
    }, 'image/jpeg');
  });
}
