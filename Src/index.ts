import {ReadFile, ReadFilesFromInput} from "./Utils/ReadFilesFromInput";
import {CopyTextToClipboard} from "./Utils/CopyTextToClipboard";
import {OptimizeImage} from "./Utils/OptimizeImage";

const $inputFile = document.querySelector('#input-file') as HTMLInputElement;
const $output = document.querySelector('#output') as HTMLDivElement;

async function setImageFile(file: File) {
	if (!file) {
		return alert('Файл не выбран');
	}
	switch (file.type) {
		case 'image/png':
		case 'image/jpg':
		case 'image/jpeg':
			break;
		default:
			return alert(`Неподдерживаемый формат: ${ file.type }`)
	}
	const { base64 } = await ReadFile(file);
	$output.innerHTML = '';

	const origBase64 = base64;
	const { jpg, png } = await OptimizeImage(base64, {
		MaxSize: 500,
		Quality: 40,
	});

	const origStat = {
		base64: origBase64,
		isSmaller: true,
		name: 'Оригинальная',
	};
	const jpgStat = {
		base64: jpg,
		isSmaller: false,
		name: 'JPG',
	};
	const pngStat = {
		base64: png,
		isSmaller: false,
		name: 'PNG',
	};
	let currentSmaller = origStat;
	const list = [origStat, jpgStat, pngStat];

	for (const item of list) {
		if (item.base64.length < currentSmaller.base64.length) {
			currentSmaller.isSmaller = false;
			item.isSmaller = true;
			currentSmaller = item;
		}
	}


	const $original = createOutput(
		`${ renderIsSmaller(origStat) }Original image:`,
		origBase64,
	);
	const $jpg = createOutput(
		`${ renderIsSmaller(jpgStat) }JPG image:`,
		jpg,
	);
	const $png = createOutput(
		`${ renderIsSmaller(pngStat) }PNG image:`,
		png,
	);

	const $best = createOutput(
		`Оптимальный [${ currentSmaller.name }]:`,
		currentSmaller.base64,
	);

	$output.appendChild($best);
	$output.appendChild($original);
	$output.appendChild($jpg);
	$output.appendChild($png);
}

window.addEventListener('paste', async event => {
	const files = (event.clipboardData?.files || []);
	if (!files.length) {
		return alert('Отсутствуют файлы в буфере обмена')
	}
	await setImageFile(files[0]);
});

$inputFile.addEventListener('change', async () => {
	const files = await ReadFilesFromInput($inputFile);
	await setImageFile(files[0])
});

function renderIsSmaller(item: { isSmaller: boolean }) {
	if (!item.isSmaller) {
		return '';
	}
	return '[Наименьшая длина] '
}

function createOutput(title: string, base64: string): HTMLDivElement {
	const $el = createElement('div', 'output-item');
	const $title = createElement('div', 'output-item__title');
	const $image = createElement('img', 'output-item__image');
	const $base64 = createElement('div', 'output-item__base64');
	const $base64Buttons = createElement('div', 'output-item__buttons');
	const $base64Copy = createElement('button', 'output-item__copy');
	$base64Copy.innerHTML = 'Скопировать код';
	const $base64CopyJSDoc = createElement('button', 'output-item__copy');
	$base64CopyJSDoc.innerHTML = 'Скопировать в формате jsdoc';
	const $base64Toggle = createElement('button', 'output-item__toggle');
	$base64Toggle.innerHTML = 'Показать/скрыть код';
	const $base64Code = createElement('code', 'output-item__base64-code');
	const $base64Caption = createElement('div', 'output-item__base64-caption');

	$base64Copy.addEventListener('click', async event => {
		event.preventDefault();
		const [isSuccess, error] = await CopyTextToClipboard(base64);
		if (error) {
			return alert(error.message);
		}
		if (!isSuccess) {
			return alert('Не удалось скопировать!');
		}
		return alert('Скопировано!');
	})
	$base64Toggle.addEventListener('click', event => {
		event.preventDefault();
		$base64.classList.toggle('_show-code');
	});
	$base64CopyJSDoc.addEventListener('click', async event => {
		event.preventDefault();
		const [isSuccess, error] = await CopyTextToClipboard(`![design](${ base64 })`);
		if (error) {
			return alert(error.message);
		}
		if (!isSuccess) {
			return alert('Не удалось скопировать!');
		}
		return alert('Скопировано!');
	});

	$base64Buttons.appendChild($base64CopyJSDoc);
	$base64Buttons.appendChild($base64Copy);
	$base64Buttons.appendChild($base64Toggle);
	$base64.appendChild($base64Caption);
	$base64.appendChild($base64Buttons);
	$base64.appendChild($base64Code);

	$title.innerHTML = `${ title } [char length: ${ base64.length }]`;
	$image.src = base64;
	$base64Code.innerText = base64;

	$el.appendChild($title);
	$el.appendChild($image);
	$el.appendChild($base64);

	return $el;
}

function createElement<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	className?: string,
	style?: HTMLElementTagNameMap[K]['style'],
): HTMLElementTagNameMap[K] {
	if (!style) {
		style = {} as any;
	}
	const $element = document.createElement(tag);
	if (className) {
		$element.classList.add(className);
	}
	for (const key in style) {
		if (!Object.hasOwnProperty.call(style, key)) {
			continue;
		}
		($element.style as any)[key] = style[key];
	}
	return $element;
}
