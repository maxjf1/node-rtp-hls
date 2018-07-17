import { spawn } from 'child_process'
const server = 'rtp://@234.0.0.10:5004'
const segmentSize = 10
const outputPath = 'video/out%03d.mp4'
const ignoredErrors = [
    'no frame!',
    'Last message repeated 1 times',
    'decode_slice_header error',
    'decode_slice_header error',
    'non-existing PPS 0 referenced']

const child = spawn('ffmpeg', (`-i ${server} -vcodec copy -acodec copy -f segment -segment_time ${segmentSize} -segment_format_options movflags=+rtphint ${outputPath}`).split(' '))

child.stdout.on('data', data =>
    console.log(`[i]: ${data}`)
)

child.stderr.on('data', data => {
    const error = data.toString().trim()
    if (ignoredErrors.find(err => error.indexOf(err) !== -1))
        return;
    console.error(`[e]: ${error}`)
})

child.on('exit', (code, signal) =>
    console.log(`child process exited with code ${code} and signal ${signal}`))

