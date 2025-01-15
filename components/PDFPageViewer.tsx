/*
 * @Author: Dai_zx
 * @Email: dzx@spacemv.net
 * @Date: 2025-01-15 16:26:48
 * @Description: 描述
 */
'use client'

import {useEffect, useRef} from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import {PDFPageProxy} from 'pdfjs-dist'
import 'pdfjs-dist/build/pdf.worker.mjs'

// 设置 PDF.js worker 路径
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface PDFPageViewerProps {
    pageNumber: number
    pdfUrl: string
    rotation: number
    onRotate: () => void
}

export default function PDFPageViewer({pageNumber, pdfUrl, rotation, onRotate}: PDFPageViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pdfPageRef = useRef<PDFPageProxy | null>(null);

    useEffect(() => {
        const loadPage = async () => {
            if (!canvasRef.current) return

            try {
                const loadingTask = pdfjsLib.getDocument(pdfUrl)
                const pdf = await loadingTask.promise
                pdfPageRef.current = await pdf.getPage(pageNumber)
                renderPage()
            } catch (error) {
                console.error('Error loading PDF:', error)
            }
        }

        loadPage()
    }, [pdfUrl, pageNumber])

    const renderPage = async () => {
        if (!canvasRef.current || !pdfPageRef.current) return

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        if (!context) return

        const viewport = pdfPageRef.current.getViewport({scale: 1.0})
        const scale = 300 / viewport.width
        const scaledViewport = pdfPageRef.current.getViewport({scale})

        canvas.width = scaledViewport.width
        canvas.height = scaledViewport.height

        context.clearRect(0, 0, canvas.width, canvas.height)

        const renderContext = {
            canvasContext: context,
            viewport: scaledViewport,
        }

        await pdfPageRef.current.render(renderContext).promise
    }

    return (
        <div className="border rounded-lg overflow-hidden shadow-md bg-white p-4">
            <div className="flex justify-center mb-4">
                <button
                    onClick={onRotate}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center gap-1"
                >
                    ↻
                </button>
            </div>
            <div className="flex items-center justify-center min-h-[400px]">
                <div style={{transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s ease'}}>
                    <canvas
                        ref={canvasRef}
                        className="mx-auto"
                    />
                </div>
            </div>
            <div className="text-center mt-2 text-sm text-gray-600">
                Page {pageNumber}
            </div>
        </div>
    )
}