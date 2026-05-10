// Không dùng any. Tất cả kiểu rõ ràng.

export type Feature = Float32Array;

/**
 * Downscale ảnh về 32x32, tính vector đặc trưng gồm:
 * - mean R, mean G, mean B (3)
 * - histogram 4-bin cho mỗi kênh (12)
 * Tổng cộng 15 chiều. Nhẹ, chạy ngay trong browser.
 */
export async function imageToFeature(input: Blob | string): Promise<Feature> {
  const bmp = await toImageBitmap(input);
  const size = 32;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available");

  ctx.drawImage(bmp, 0, 0, size, size);
  const img = ctx.getImageData(0, 0, size, size).data;

  let sumR = 0, sumG = 0, sumB = 0;
  const binsR = new Uint32Array(4);
  const binsG = new Uint32Array(4);
  const binsB = new Uint32Array(4);

  for (let i = 0; i < img.length; i += 4) {
    const r = img[i] as number;
    const g = img[i + 1] as number;
    const b = img[i + 2] as number;
    sumR += r; sumG += g; sumB += b;

    binsR[Math.min(3, (r / 64) | 0)]++;
    binsG[Math.min(3, (g / 64) | 0)]++;
    binsB[Math.min(3, (b / 64) | 0)]++;
  }

  const n = (img.length / 4) as number;
  const meanR = sumR / n;
  const meanG = sumG / n;
  const meanB = sumB / n;

  const feat = new Float32Array(15);
  feat[0] = meanR; feat[1] = meanG; feat[2] = meanB;

  // Chuẩn hoá histogram về [0,1]
  for (let i = 0; i < 4; i++) {
    feat[3 + i] = binsR[i] / n;
    feat[7 + i] = binsG[i] / n;
    feat[11 + i] = binsB[i] / n;
  }

  return feat;
}

export function l2(a: Feature, b: Feature): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s);
}

async function toImageBitmap(input: Blob | string): Promise<ImageBitmap> {
  if (typeof input === "string") {
    const img = await loadImage(input);
    return createImageBitmap(img);
  } else {
    return await createImageBitmap(input);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // RẤT QUAN TRỌNG: dùng ảnh same-origin để không bị tainted canvas
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Cannot load image: ${src}`));
    img.src = src;
  });
}
