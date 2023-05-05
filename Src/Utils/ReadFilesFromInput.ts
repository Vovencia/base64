import {ArrayBufferToBase64} from "./ArrayBufferToBase64";

export async function ReadFilesFromInput($input: HTMLInputElement): Promise<Array<{
	buffer: ArrayBuffer,
	base64: string;
}>> {
	const files = new Array($input.files?.length || 0).fill(0).map((_, index) => {
		return ($input.files || [])[index];
	}).filter(item => item !== null);

	const result: Array<{
		buffer: ArrayBuffer,
		base64: string;
	}> = [];
	for (const file of files) {
		const buffer = await GetArrayBufferFromFile(file);
		const base64 = `data:${ file.type };base64,${ ArrayBufferToBase64(buffer) }`;
		result.push({
			buffer,
			base64,
		});
	}
	return result;
}

export async function GetArrayBufferFromFile(file: File): Promise<ArrayBuffer> {
	return new Promise<ArrayBuffer>(resolve => {
		const reader = new FileReader();
		reader.onload = function() {
			resolve(this.result as ArrayBuffer);
		};
		reader.readAsArrayBuffer(file);
	});
}
