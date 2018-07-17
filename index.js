import { spawn } from 'child_process'
import { readdirSync, unlinkSync } from 'fs'
import { join } from 'path'
import express from 'express'
import cors from 'cors'

const app = express()

import { server, segmentSize, outputFolder, outputPath, ignoredErrors, serverPort, demoHtmlFolder } from './settings'

function clearFolder() {
    const files = readdirSync(outputFolder)
    let removed = 0;
    //console.log('Starting from dir '+startPath+'/');
    files.forEach(file => {
        if (file.indexOf('.m3u8') !== -1 || file.indexOf('.ts') !== -1) {
            unlinkSync(join(outputFolder, file))
            removed++;
        }
    })
    console.log(`Pasta limpa. Removido ${removed} arquivos.`)
}

function strContains(text, contain) {
    return text.indexOf(contain) !== -1
}

let segments = 0

function handleMessage(data) {
    const message = data.toString().trim()
    if (!message || ignoredErrors.find(err => message.indexOf(err) !== -1))
        return;
    if (message.indexOf(outputPath) !== -1) {
        segments++
        return console.info(`Novo segmento adicionado. (total ${segments})`)
    }
    if (strContains(message, 'index0.ts'))
        return console.info('Transmissão iniciada')
    console.info(`[e] ${message}`)
}

function initServer() {
    const child = spawn('ffmpeg', [
        `-i ${server}`, // servidor de origem
        '-vcodec copy', // Codec de Video  (auto)
        '-acodec copy', // Codec de Audio  (auto)
        `-hls_time ${segmentSize}`,  // Tamanho dos segmentos HLS
        '-hls_list_size 0', // Tamanho da lista (streaming) 
        `-f hls ${outputPath}` // Saida HLS
    ].join(' ').split(' '))

    child.stdout.on('data', data =>
        console.log(`[i]: ${data}`)
    )

    child.stderr.on('data', handleMessage)

    child.on('exit', (code, signal) => {
        if (code !== '1') {
            console.warn(`Erro na transmissão. Reiniciando... (código ${code} / sinal ${signal})`)
            initServer()
        }
        else
            console.log(`Transmissão finalizada com sucesso.`)
    })
}

clearFolder()
initServer()

app.use('/', express.static(demoHtmlFolder))
app.use('/video', cors(), express.static(outputFolder))

app.listen(serverPort, () => console.log(`Servidor HTTP inicado na porta ${serverPort} (http://localhost:${serverPort}/).`))

export default app