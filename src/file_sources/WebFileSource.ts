import FileSource from '../FileSource'

export default class WebFileSource implements FileSource {
    public readonly baseUrl: string

    constructor(baseUrl: string) {
        // Remove trailing slash for consistent URL construction
        this.baseUrl = baseUrl.replace(/\/$/, '')
    }

    list(path: string): Promise<string[]> {
        throw new Error('WebFileSource does not support directory listing')
    }

    isDirectory(path: string): Promise<boolean> {
        throw new Error('WebFileSource does not support directory checking')
    }

    async read(path: string): Promise<ArrayBuffer> {
        const url = `${this.baseUrl}/${path}`
        
        try {
            const response = await fetch(url)
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            return await response.arrayBuffer()
        } catch (error) {
            throw new Error(`Failed to fetch ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    async write(path: string, data: string | Uint8Array): Promise<void> {
        const url = `${this.baseUrl}/${path.replace(/^\//, '')}`
        
        try {
            const response = await fetch(url, {
                method: 'PUT',
                body: data,
                headers: {
                    'Content-Type': typeof data === 'string' ? 'text/plain' : 'application/octet-stream'
                }
            })
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
        } catch (error) {
            throw new Error(`Failed to write to ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}
