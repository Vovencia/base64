/**
 * Обработка ошибки в промисах
 *
 * @param value
 * @returns [результат, null] или [null, ошибка]
 */
export async function ResultError<IResult, IError = Error>(
	value: IResultErrorValue<IResult>,
): Promise<IResultError<IResult, IError>> {
	if (typeof value === 'function') {
		try {
			value = (value as any)();
		} catch (e) {
			return [null, e as any];
		}
	}
	if ((value as any).toPromise) {
		try {
			value = (value as any).toPromise();
		} catch (e) {
			return [null, e as any];
		}
	}
	if (value instanceof Promise) {
		try {
			value = await value;
		} catch (e) {
			return [null, e as any];
		}
	}
	return [value as any, null];
}

export function ToResultError<IResult, IError = Error>(
	result?: IResult | null | undefined,
	error?: IError | null | undefined,
): IResultError<IResult, IError> {
	if (error) {
		return [null, error];
	}
	return [result as IResult, null];
}

export type IResultError<IResult = any, IError = Error> =
	| [IResult, null]
	| [null, IError];

export type IResultErrorValue<IResult> =
	| (() => Promise<IResult> | IResult)
	| Promise<IResult>
	| { toPromise: () => Promise<IResult> | IResult }
	| IResult;
