import {IResultError, ResultError} from "./ResultError";

async function fallbackCopyTextToClipboard(text: string): Promise<boolean> {
	const textArea = document.createElement("textarea");
	textArea.value = text;

	// Avoid scrolling to bottom
	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.position = "fixed";

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	let isSuccess = false;
	let error: any = null;

	try {
		isSuccess = document.execCommand('copy');
	} catch (err) {
		error = err;
	}

	document.body.removeChild(textArea);
	if (error) {
		throw error;
	}
	return isSuccess;
}

/**
 * @param text
 * @see https://stackoverflow.com/a/30810322
 */
export async function CopyTextToClipboard(text: string): Promise<IResultError<boolean>> {
	return ResultError(() => {
		if (!navigator.clipboard) {
			return fallbackCopyTextToClipboard(text);
		}
		return new Promise<boolean>((resolve, reject) => {
			navigator.clipboard.writeText(text).then(() => {
				resolve(true);
			}, (err) => {
				reject(err);
			});
		});
	});
}
