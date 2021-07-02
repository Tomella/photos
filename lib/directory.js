import { promises as FS } from "fs";
import { basename, join, extname } from "path";


async function dirFiles(path) {
    const name = basename(path);
    const item = { path, name, children: [] };
    let stats;

    try {
        stats = await FS.stat(path);
    } catch (e) {
        return null;
    }

    if (stats.isDirectory()) {
        let dirData = await FS.readdir(path);;
        if (dirData === null) return null;

        for (var i = 0; i < dirData.length; i++) {
            let data = await files(join(path, dirData[i]));
            if (data.isFile) {
                data.name = dirData[i];
                item.children.push(data);
            }
        }
    } else {
        return null; // Or set item.size = 0 for devices, FIFO and sockets ?
    }
    return item;
}

async function files(path) {
    const ext = extname(path).toLowerCase();
    let stats;

    try {
        stats = await FS.stat(path);
    } catch (e) {
        return null;
    }

    return {
        size: stats.size,
        extension: ext,
        isFile: stats.isFile()
    };
}

export { dirFiles };
