import FileSource from '../FileSource'
import fs from 'fs'
import nodePath from 'path'

export default class FileSystemSource implements FileSource {
    public readonly root: string

    constructor(root: string) {
        this.root = root.replace(/^file:\/\//, '')
    }

    list(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(nodePath.join(this.root, path), (err, files) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(files)
            })
        })
    }
    
    isDirectory(path: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.stat(nodePath.join(this.root, path), (err, stats) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(stats.isDirectory())
            })
        })
    }

    read(path: string): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            fs.readFile(nodePath.join(this.root, path), (err, data) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(data.buffer)
            })
        })
    }

    write(path: string, data: string | Uint8Array): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(nodePath.join(this.root, path), data, (err) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve()
            })
        })
    }
}