import child_process from 'child_process';
import { Response } from 'express';

export const GetTimestampByteMatch = (fileName) => {
    const ffprobe = child_process.spawnSync(
        'ffprobe',
        [
            '-i', `/home/pertinate/fileserver/${fileName}`,
            '-show_entries', 'packet=pos,pts_time,flags',
            '-select_streams', 'v', '-of', 'compact=p=0:nk=1', '-v', '0'
        ]
    )

    return ffprobe.stdout.toString().split('\n').map(v => {
        let ts = v.trim().split('|');
        return {
            time: ts[0],
            byte: ts[1]
        }
    })
}

export const GetSegmentedStream = (fileName: string, start: string, end: string) => {
    const ffmpeg = child_process.spawn(
        'ffmpeg',
        [
            '-ss', start,
            '-i', `/home/pertinate/fileserver/${fileName}`,
            '-ss', end,
            '-'
        ]
    )

    return ffmpeg.stdout;
}