
import {GlobalWorkerOptions } from 'pdfjs-dist/build/pdf'
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;