import * as fsAsync from 'node:fs/promises'
import {basename, dirname, extname, join, parse, resolve} from "node:path";
import {platform} from "node:os"
import {exec,execSync} from "child_process";
import * as fs from "node:fs"
import * as constants from "constants";

class FileSystem {

    public basename(name: string) {
        return basename(name)
    }

    public dirname(name: string) {
        return dirname(name)
    }

    public extension(name: string) {
        return extname(name)
    }

    public move(currentPath: string, targetPath: string): void {
        return fs.renameSync(currentPath, targetPath)
    }

    public copy(currentPath: string, targetPath: string) {
        return fs.copyFileSync(currentPath, targetPath)
    }

    public symlink(link: string, target: string) {
        const mode = this.isDirectory(target) ? 'J' : 'H'
        try {
            execSync(`mklink /${mode} "${link}" "${target}"`)
            return true
        } catch (error) {
            /** @ts-ignore */
            throw new Error(error.message)
        }
    }

    public isDirectory(name: string) {
        return fs.statSync(name).isDirectory()
    }

    public info(path: string) {
        return parse(path)
    }

    public type(path: string) {
        return fsAsync.lstat(path)
            .then(stats => {
                return stats.isFile() ? 'File' : stats.isDirectory()
                    ? 'Directory' : 'Other'
            })
            .catch(err => {
                throw err
            })
    }

    public size(name: string) {
        return this.convertBytes(fs.lstatSync(name).size)
    }

    public lastModified(name: string) {
        return this.convertBytes(fs.lstatSync(name).mtime)
    }

    public isReadable(name: string) {
        return fs.accessSync(name, constants.R_OK)
    }

    public isWritable(name: string) {
        return fs.accessSync(name, constants.W_OK)
    }

    public isFile(name: string) {
        return fs.lstatSync(name).isFile()
    }

    public makeDirectory(path: string, mode: number = 0o777, recursive: boolean = false, force: boolean = false) {
        if (force) {
            fs.mkdirSync(path, {recursive, mode})
            return true
        }

        fs.mkdirSync(path, {recursive, mode})
        return true
    }

    public directoryExists(path: string, mode: number = 0o777, recursive: boolean = true) {
        if (!this.isDirectory(path)) {
            return this.makeDirectory(path, mode, recursive)
        }

        return true
    }

    public moveDirectory(from: string, to: string, overwrite: boolean = false) {
        if (overwrite && this.isDirectory(to) && !this.deleteDirectory(to)) {
            return false
        }

        fs.renameSync(from, to)

        return true
    }

    public deleteDirectory(directory: string, preserver: boolean = false) {
        if (!this.isDirectory(directory)) {
            return false
        }

        fsAsync.readdir(directory)
            .then(items => {
                items.forEach(item => {
                    const itemPath = join(directory, item)

                    if (fs.statSync(itemPath).isDirectory() && !fs.lstatSync(itemPath).isSymbolicLink()) {
                        /** @ts-ignore */
                        this.deleteDirectory(itemPath)
                    } else {
                        fs.unlinkSync(itemPath)
                    }
                })
            })

        if (!preserver) {
            fs.rmdirSync(directory)
        }
    }

    public directories(directory: string, hidden: boolean = false) {
        let directories: any = []

        fsAsync.readdir(directory, {withFileTypes: true})
            .then(items => {
                items.forEach(item => {
                    if (item.isDirectory()) {
                        if (!hidden && item.name.startsWith('.')) {
                            return;
                        }

                        directories.push(item.name)
                    }
                })
            })

        return directories
    }

    public deleteDirectories(directory: string) {
        const allDirectories = this.directories(directory)

        if (!allDirectories) {
            allDirectories.forEach((directoryName: string) => this.deleteDirectory(directoryName))

            return true
        }

        return false
    }

    public copyDirectory(directory: string, destination: string, options: number | null) {
        if (!this.isDirectory(directory)) {
            return false
        }

        fs.mkdirSync(destination, {recursive: true})

        const files = fs.readdirSync(directory, {withFileTypes: true})

        for (const file of files) {
            const sourcePath = join(directory, file.name)
            const destinationPath = join(destination, file.name)

            if (file.isDirectory()) {
                /** @ts-ignore */
                this.copyDirectory(sourcePath, destinationPath, options)
            } else {
                // @ts-ignore
                fs.copyFileSync(sourcePath, destinationPath, options)
            }
        }

        return true

    }

    public cleanDirectory(directory: string) {
        return this.deleteDirectory(directory, true)
    }

    public delete(paths: string | Array<string>) {
        if (!Array.isArray(paths)) {
            paths = [paths]
        }

        let success = true

        for (const path of paths) {
            try {
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path)
                    fs.statSync(path)
                } else {
                    success = false
                }
            } catch (e) {
                success = false
            }
        }

        return true
    }

    public replace(path: string, content: string) {
        const resolvedPath = resolve(path)

        const tempPath = fs.mkdtempSync(`${dirname(resolvedPath)}/${basename(resolvedPath)}`)

        fs.writeFileSync(tempPath, content)

        fs.chmodSync(tempPath, '0777')

        fs.renameSync(tempPath, resolvedPath)

        return true
    }

    public replaceInFile(search: string[], replace: string[], path: string) {
        let fileContent = fs.readFileSync(path, 'utf-8')

        search = Array.isArray(search) ? search : [search]
        replace = Array.isArray(replace) ? replace : [replace]

        for (let i = 0; i < search.length; i++) {
            fileContent = fileContent.replace(new RegExp(search[i], 'g'), replace[i])
        }

        fs.writeFileSync(path, fileContent, 'utf-8')

        Buffer.byteLength(fileContent, 'utf-8')

        return true
    }

    public append(path: string, data: string) {

        fs.appendFileSync(path, data)

        Buffer.byteLength(data)

        return true
    }

    public chmod(path: string, mode: number | null = null) {
        if (mode) {
            return fs.chmodSync(path, mode)
        }

        const stats = fs.statSync(path)
        return (stats.mode && 0o777).toString(8)
    }

    public filePerm(file: string) {
        const stats = fs.statSync(file)
        return (stats.mode && 0o777).toString(8)
    }

    public getDisks(callback: (drives: string[]) => void | Array<string>) {

        if (platform() === 'win32') {

            exec('fsutil fsinfo drives', (error, stdout, stderr) => {
                if (error) {
                    throw new Error(error.message)
                }

                let disks = stdout.trim().split(' ')

                if (disks[0] !== 'Drives:') {
                    return false
                }

                disks.splice(0, 1)

                callback(disks)
            })

        } else {
            exec('mount', (error, stdout) => {
                if (error) {
                    throw new Error(error.message)
                }

                const cmdExp = stdout.trim().split(' ')

                cmdExp.forEach(value => {
                    if (value.includes('/dev/')) {
                        callback([value])
                    }
                })
            })

        }
    }

    public convertBytes(bytes: any) {
        const types = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const exp = bytes ? Math.floor(Math.log(bytes) / Math.log(1024)) : 0

        return `${(bytes / 1024 ** exp).toFixed(2)} ${types[exp]}`
    }

    public freeDiskSpace(direction: string, total: boolean = false) {

        const {blksize, blocks, size} = fs.statSync(direction)

        if (total) {
            return this.convertBytes(blksize * blocks)
        }

        return this.convertBytes(blksize * blocks - size)
    }
}

export default FileSystem
