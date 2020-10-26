import express, { response } from 'express';
import { redisClient } from '../redis';
import dirTree from 'directory-tree';
import { absPath } from '..';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { GetSegmentedStream, GetTimestampByteMatch } from '../ffmpeg';
import { Readable } from 'stream';
import { MakeTimestamp } from '../util';

const router = express.Router();

router.get('/test', (request, response) => {
    response.status(200).send({ test: 'hello' })
})

router.get('/video', async (request, response) => {
    if (!request.query.name || !request.query.start || !request.query.end) {
        response.status(403).send('Queries supplied are incorrect');
        return;
    }
    console.log(parseFloat(request.query.start.toString()))
    // if (!parseFloat(request.query.start.toString()) || !parseFloat(request.query.end.toString())) {
    //     response.status(400).send('The queries start or end were not numbers')
    //     return;
    // }
    // console.log(request.query)
    let segments = GetTimestampByteMatch(request.query.name);
    // console.log(segments);
    let lowestSegments = segments.filter(segment => Number(segment.byte) <= Number(request.query.start))
    let lowest = lowestSegments.length === 0 ? segments[0] : lowestSegments.reduce((prev, curr) => (Math.abs(Number(curr.byte) - Number(request.query.start)) < Math.abs(Number(prev.byte) - Number(request.query.start)) ? curr : prev));
    let highestSegments = segments.filter(segment => segment.byte >= request.query.end)
    let highest = highestSegments.length === 0 ? segments[segments.length - 1] : highestSegments.reduce((prev, curr) => (Math.abs(Number(curr.byte) - Number(request.query.end)) < Math.abs(Number(prev.byte) - Number(request.query.end)) ? curr : prev));

    console.log(lowest, highest);
    let stat = fs.statSync(`/home/pertinate/fileserver/${request.query.name}`);
    console.log(stat.size)
    response.setHeader('fileSize', stat.size);
    console.log(lowest.time, Number(lowest.time))
    let start = MakeTimestamp(lowest.time);
    let end = MakeTimestamp(highest.time)
    console.log(start, end, request.query.name)
    let test = GetSegmentedStream(request.query.name.toString(), '00:00:00', '00:00:30')
    let chunks = [];
    for await (let chunk of test) {
        chunks.push(chunk)
    }
    response.send(Buffer.concat(chunks))

    // response.send(GetSegmentedStream(request.query.name.toString(), start, end))
    // fs.readFile(`${absPath}/${request.query.name}`, (error, data) => {
    //     if (error) {
    //         if (error.code === 'ENOENT') {
    //             response.status(404).send('File not found.');
    //         } else {
    //             console.error(error);
    //             response.status(500).send('There was an error with the server');
    //         }
    //     } else {
    //         response.setHeader('Content-Type', 'video/mp4');
    //         response.setHeader('Content-Size', data.length);
    //         response.status(200).send(data);
    //     }
    // })
})

router.get('/write-matched', (request, response) => {
})

router.get('/', (request, response) => {
    const tree = dirTree(absPath)
    response.send(tree)
});

export default router;