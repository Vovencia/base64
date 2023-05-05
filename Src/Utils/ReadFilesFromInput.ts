import { ArrayBufferToBase64 } from "./ArrayBufferToBase64";

export async function ReadFilesFromInput($input: HTMLInputElement): Promise<File[]> {
	const files = new Array($input.files?.length || 0).fill(0).map((_, index) => {
		return ($input.files || [])[index];
	}).filter(item => item !== null);

	const result: File[] = [];
	for (const file of files) {
		result.push(file);
	}
	return result;
}

export async function ReadFile(file: File): Promise<{
	buffer: ArrayBuffer,
	base64: string;
}> {
	const buffer = await GetArrayBufferFromFile(file);
	const base64 = `data:${ file.type };base64,${ ArrayBufferToBase64(buffer) }`;
	return {
		buffer,
		base64,
	};
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
