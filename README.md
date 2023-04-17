# Node Typescript File System Class

- ##### Typescript version of the filesystem class used in Laravel

### All Functions

| Function name                                                                                                                        | Description                                                                                     |
|--------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `symLink(link: string, target: string)`                                                                                              | Create a symbolic link.                                                                         |
| `directoryExists(path: string, mode: number = 0o777, recursive: boolean = true)`                                                     | Checks if a folder exists or creates a folder.                                                  |
| `filePerm(file: string)`                                                                                                             | Shows file permissions as octal values.                                                         |
| `deleteDirectories(directory: string)`                                                                                               | Deletes multiple folders within the folder.                                                     |
| `basename(name: string)`                                                                                                             | Returns the specified filename.                                                                 |
| `dirname(name: string)`                                                                                                              | Returns the folder name of the file path.                                                       |
| `extension(name: string)`                                                                                                            | Gives the file extension.                                                                       |
| `move(currentPath: string, targetPath: string)`                                                                                      | Moves the file to the folder with the new name.                                                 |
| `copy(currentPath: string, targetPath: string)`                                                                                      | Copies the file to the folder with the new name.                                                |
| `info(path: string)`                                                                                                                 | Gives information about the file.                                                               |
| `type(path: string)`                                                                                                                 | Returns the file type.                                                                          |
| `size(name: string)`                                                                                                                 | Returns the size of the file .                                                                  |
| `lastModified(name: string)`                                                                                                         | Returns the last edited time of the file.                                                       |
| `isDirectory(name: string)`                                                                                                          | Tells if a file is a directory.                                                                 |
| `isReadable(name: string)`                                                                                                           | Tells if a file exists and is readable.                                                         |
| `isWritible(name: string)`                                                                                                           | Tells if a file is writable.                                                                    |
| `isFile(name: string)`                                                                                                               | Tells if a file is an ordinary file.                                                            |
| `moveDirectory(from: string, to: string, overwrite: boolean = false)`                                                                | Moves the folder, checks for existence.                                                         |
| `deleteDirectory(directory: string, preserver: boolean = false)`                                                                     | Deletes the folder, checks its existence, deletes it by doing detailed folder analysis.         |
| `directories(directory: string, hidden: boolean = false)`                                                                            | Get all of the directories within a given directory.                                            |
| `copyDirectory(directory: string, destination: string, options: number                                  \| null)`                    | Copy a directory from one location to another.                                                  |
| `cleanDirectory(directory: string)`                                                                                                  | Deletes all files in the folder..                                                               |
| `delete(paths: string                                                                                             \| Array<string>)` | Delete the file at a given path.                                                                |
| `makeDirectory(path: string, mode: number = 0o777, recursive: boolean = false, force: boolean = false)`                              | Creates folder with specified name, permission.                                                 |
| `replace(path: string, content: string)`                                                                                             | Write the contents of a file, replacing it atomically if it already exists.                     |
| `replaceInFile(search: string[], replace: string[], path: string)`                                                                   | Saves by replacing the data in an existing file..                                               |
| `append(path: string, data: string)`                                                                                                 | If the filename file exists, the data is not overwritten, but appended to the end..             |
| `chmod(path: string, mode: number \|  null = null)`                                                                                  |                                                                                                 | Sets the file privilege, if the $mod parameter is empty, it returns the current privilege of the file. |
| `getDisks()`                                                                                                                         | Returns the disks of the machine on which PHP is installed.                                     |
| `freeDiskSpace(direction: string, total: boolean = false)`                                                                           | Shows the free space on the disk. Returns the total disk space if the $total parameter is true. |



