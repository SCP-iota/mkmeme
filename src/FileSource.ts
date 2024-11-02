export default interface FileSource {
    list(path: string): Promise<string[]>
    isDirectory(path: string): Promise<boolean>
    read(path: string): Promise<ArrayBuffer>
    write(path: string, data: string | Uint8Array): Promise<void>
}

export const fileSourceRegistry = new Map<string, new (url: string) => FileSource>()

function canonicalizeURL(input: string): string {
    if(/^[+\w]+:\/\//.test(input)) {
        return input
    } else {
        return 'file://' + input
    }
}

export function resolveFileSource(path: string): FileSource {
    const url = canonicalizeURL(path)

    for (const [prefix, source] of fileSourceRegistry) {
        if (url.startsWith(prefix)) {
            return new source(url)
        }
    }

    throw new Error(`Unrecognized file source type for ${url}`)
}