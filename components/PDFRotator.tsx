'use client'

import { useState } from 'react'
import { PDFDocument, degrees } from 'pdf-lib'
import PDFPageViewer from '@/components/PDFPageViewer'
import UploadZone from '@/components/UploadZone'

interface PageInfo {
  pageNumber: number
  rotation: number
}

export function PDFRotator() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string>('')
  const [pageRotations, setPageRotations] = useState<PageInfo[]>([])
  const [numPages, setNumPages] = useState(0)

  const handleFileChange = async (file: File) => {
    setFile(file)
    const url = URL.createObjectURL(file)
    setPdfUrl(url)

    const fileBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(fileBuffer)
    const pages = pdfDoc.getPages()
    setNumPages(pages.length)
    setPageRotations(pages.map((_, index) => ({
      pageNumber: index + 1,
      rotation: 0
    })))
  }

  const handleRotatePage = (pageNumber: number) => {
    setPageRotations(prev => prev.map(page => {
      if (page.pageNumber === pageNumber) {
        const currentRotation = page.rotation || 0
        return {
          ...page,
          rotation: (currentRotation + 90) % 360
        }
      }
      return page
    }))
  }

  const handleSave = async () => {
    if (!file) return

    try {
      const fileBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(fileBuffer)
      const pages = pdfDoc.getPages()

      pageRotations.forEach(({ pageNumber, rotation }) => {
        const page = pages[pageNumber - 1]
        page.setRotation(degrees(rotation))
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `rotated-${file.name}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error rotating PDF:', error)
      alert('Error rotating PDF. Please try again.')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {!file ? (
        <UploadZone onFileSelect={handleFileChange} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
              <PDFPageViewer
                key={pageNum}
                pageNumber={pageNum}
                pdfUrl={pdfUrl}
                rotation={pageRotations.find(p => p.pageNumber === pageNum)?.rotation || 0}
                onRotate={() => handleRotatePage(pageNum)}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         transition-colors duration-200 flex items-center space-x-2"
            >
              <span>下载PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}