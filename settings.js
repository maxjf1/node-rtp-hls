export const server = 'rtp://@234.0.0.10:5004'
export const segmentSize = 10
export const demoHtmlFolder = 'public'
export const outputFolder = 'video'
export const outputPath = outputFolder + '/index.m3u8'
export const serverPort = 3000
export const ignoredErrors = [
    'no frame!',
    'Last message repeated 1 times',
    'decode_slice_header error',
    'decode_slice_header error',
    'non-existing PPS 0 referenced',
    'ffmpeg version',
    'frame=',
    'libav',
    'Press [q]',
    'service_name',
    'Stream #0'
]
