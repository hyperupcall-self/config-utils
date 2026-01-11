export function findUp(
	name: string,
	{ cwd, type, stopAt }?: FindUpOptions,
): Promise<string>

export function findUpSync(name: string, { cwd, type, stopAt }?: FindUpOptions): string

export function skipArrayMergeDeep(target: any, source: any): any

export type FindUpOptions = {
	cwd?: string
	type?: string
	stopAt?: string
}
