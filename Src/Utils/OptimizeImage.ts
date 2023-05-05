import { Jimp } from "./Jimp";

export interface IOptimizeImageOptions {
	/**
	 * @default 1000
	 */
	MaxSize?: number;
	/**
	 * 0-100
	 * @default 30
	 */
	Quality?: number;
}

export async function OptimizeImage(base64: string, options: IOptimizeImageOptions = {}): Promise<{
	jpg: string;
	png: string;
}> {
	const {
		Quality = 40,
		MaxSize = 1000,
	} = options || {};
	const image = await Jimp.read(base64);
	const width = image.getWidth();
	const height = image.getHeight();
	if (width > MaxSize || height > MaxSize) {
		if (width > height) {
			image.resize(MaxSize, Jimp.AUTO);
		} else {
			image.resize(Jimp.AUTO, MaxSize);
		}
	}
	image.background(0xffffffff);
	image.quality(Quality);
	image.deflateLevel(9);
	const jpg = await image.getBase64Async(Jimp.MIME_JPEG);
	const png = await image.getBase64Async(Jimp.MIME_PNG);
	return {
		jpg,
		png,
	};
}
