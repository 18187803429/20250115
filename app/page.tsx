/*
 * @Author: Dai_zx
 * @Email: dzx@spacemv.net
 * @Date: 2025-01-15 16:12:12
 * @Description: 描述
 */
import Head from 'next/head'
import { PDFRotator } from '@/components/PDFRotator'

export default function Home() {
  return (
    <>
      <Head>
        <title>PDF Rotation Tool - Free Online PDF Rotator</title>
        <meta name="description" content="Rotate PDF pages online for free. Easy to use PDF rotation tool that works directly in your browser. No upload needed." />
        <meta name="keywords" content="pdf rotate, rotate pdf, pdf rotation tool, free pdf rotator" />
        <meta property="og:title" content="PDF Rotation Tool" />
        <meta property="og:description" content="Rotate PDF pages online for free" />
      </Head>
      
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold text-center mb-8">
              PDF 在线处理
          </h1>
          <PDFRotator />
        </div>
      </main>
    </>
  )
}