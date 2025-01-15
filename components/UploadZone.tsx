/*
 * @Author: Dai_zx
 * @Email: dzx@spacemv.net
 * @Date: 2025-01-15 16:24:14
 * @Description: 描述
 */
'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
}

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                 transition-colors duration-200 ${
                   isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                 }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div className="text-5xl">📄</div>
        <h3 className="text-xl font-semibold text-gray-700">
          {isDragActive ? '把你的PDF放在这里' : '将PDF拖放到此处'}
        </h3>
        <p className="text-gray-500">或单击以选择文件</p>
      </div>
    </div>
  )
}