import process from 'node:process'
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

/**
 * @typedef {Object} FindUpOptions
 * @property {string} [cwd]
 * @property {string} [type]
 * @property {string} [stopAt]
 */

function toPath(urlOrPath) {
	return urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath
}

function isObject(value) {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Function from https://github.com/sindresorhus/find-up-simple/blob/v1.0.0/index.js.
export async function findUp(
	/** @type {string} */ name,
	/** @type {FindUpOptions} */ { cwd = process.cwd(), type = 'file', stopAt } = {},
) {
	let directory = path.resolve(toPath(cwd) ?? '')
	const { root } = path.parse(directory)
	stopAt = path.resolve(directory, toPath(stopAt ?? root))

	while (directory && directory !== stopAt && directory !== root) {
		const filePath = path.isAbsolute(name) ? name : path.join(directory, name)

		try {
			const stats = await fsPromises.stat(filePath) // eslint-disable-line no-await-in-loop
			if (
				(type === 'file' && stats.isFile()) ||
				(type === 'directory' && stats.isDirectory())
			) {
				return filePath
			}
		} catch {}

		directory = path.dirname(directory)
	}
}

export function findUpSync(
	/** @type {string} */ name,
	/** @type {FindUpOptions} */ { cwd = process.cwd(), type = 'file', stopAt } = {},
) {
	let directory = path.resolve(toPath(cwd) ?? '')
	const { root } = path.parse(directory)
	stopAt = path.resolve(directory, toPath(stopAt ?? root))

	while (directory && directory !== stopAt && directory !== root) {
		const filePath = path.isAbsolute(name) ? name : path.join(directory, name)

		try {
			const stats = fs.statSync(filePath)
			if (
				(type === 'file' && stats.isFile()) ||
				(type === 'directory' && stats.isDirectory())
			) {
				return filePath
			}
		} catch {}

		directory = path.dirname(directory)
	}
}

// Modified function from https://stackoverflow.com/a/34749873.
export function skipArrayMergeDeep(/** @type {any} */ target, /** @type {any} */ source) {
	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} })
				skipArrayMergeDeep(target[key], source[key])
			} else {
				Object.assign(target, { [key]: source[key] })
			}
		}
	}

	return target
}
