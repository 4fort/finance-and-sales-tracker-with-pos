'use client'

import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import React, { useRef } from 'react'
import { useToast } from '@/hooks/use-toast'

interface PrintButtonProps {
  reportTitle: string
}

export function PrintButton({
  reportTitle = 'Income Report',
}: PrintButtonProps) {
  const { toast } = useToast()

  const handlePrint = () => {
    toast({
      title: 'Preparing print view',
      description: "Your browser's print dialog will open shortly.",
    })
    // Add print-specific styles
    const style = document.createElement('style')
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        .print-section, .print-section * {
          visibility: visible !important;
        }
        .print-section {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 20mm; /* Add internal padding for content instead of page margins */
        }
        .no-print {
          display: none !important;
        }
        /* Additional print styles */
        @page {
          size: A4;
          margin: 0mm !important;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
          color: #000;
        }
        .date-printed {
          text-align: right;
          font-size: 12px;
          margin-bottom: 20px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table, th, td {
          border: 1px solid #ddd;
        }
        th, td {
          padding: 8px;
          text-align: left;
        }
      }
    `
    document.head.appendChild(style)

    // Create a header with the report title and date
    const header = document.createElement('div')
    header.innerHTML = `
      <h1>${reportTitle}</h1>
      <div class="date-printed">Printed on: ${new Date().toLocaleString()}</div>
    `

    // Find the print section
    const printSection = document.querySelector('.print-section')
    if (printSection) {
      // Insert header at the beginning of the print section
      printSection.insertBefore(header, printSection.firstChild)
    }

    // Print the document
    window.print()

    // Remove the header after printing
    if (header.parentNode) {
      header.parentNode.removeChild(header)
    }

    // Remove the style element
    document.head.removeChild(style)
  }

  return (
    <Button
      onClick={handlePrint}
      variant="outline"
      size="sm"
      className="no-print ml-auto bg-white hover:bg-gray-100">
      <Printer className="mr-2 h-4 w-4" />
      Print Report
    </Button>
  )
}
