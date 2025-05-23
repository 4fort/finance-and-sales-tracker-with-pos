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

  // Get business profile information
  const getBusinessProfile = (): { name: string; info: string } => {
    try {
      // First try to access the business profile context through window
      if (typeof window !== 'undefined') {
        // For React context, we need to check if the context state is available in window
        const businessProfileState = (window as any).__BUSINESS_PROFILE_STATE__

        if (businessProfileState?.selectedProfile) {
          const profile = businessProfileState.selectedProfile
          return {
            name: profile.shop_name || 'COTEJAR STORE BINDOY: TRACKING SYSTEM',
            info: [
              profile.street,
              profile.city,
              profile.state,
              profile.zip_code,
            ]
              .filter(Boolean)
              .join(', '),
          }
        }

        // Try localStorage as fallback
        const profileData = localStorage.getItem('businessProfile')
        if (profileData) {
          const profile = JSON.parse(profileData)
          return {
            name:
              profile.name ||
              profile.shop_name ||
              'COTEJAR STORE BINDOY: TRACKING SYSTEM',
            info: [
              profile.address ||
                [profile.street, profile.city, profile.state, profile.zip_code]
                  .filter(Boolean)
                  .join(', '),
              profile.contactInfo,
              profile.email,
            ]
              .filter(Boolean)
              .join(' • '),
          }
        }
      }

      // Try to access DOM for business profile info
      const shopNameElement = document.querySelector('[data-business-name]')
      const shopAddressElement = document.querySelector(
        '[data-business-address]',
      )

      if (shopNameElement) {
        const name =
          shopNameElement.textContent || 'COTEJAR STORE BINDOY: TRACKING SYSTEM'
        const address = shopAddressElement?.textContent || ''

        return {
          name,
          info: address,
        }
      }
    } catch (error) {
      console.error('Error getting business profile:', error)
    }

    // Default values
    return {
      name: 'COTEJAR STORE BINDOY: TRACKING SYSTEM',
      info: '',
    }
  }

  // Generate a unique report ID based on timestamp and title
  const generateReportId = (): string => {
    const timestamp = Date.now().toString(36) // Convert timestamp to base36
    const randomStr = Math.random().toString(36).substring(2, 6) // Random string
    const titleHash = reportTitle
      .split(' ')
      .map(word => word[0]?.toUpperCase()) // Get initials
      .join('')

    return `${titleHash}-${timestamp}-${randomStr}`.toUpperCase()
  }

  // Helper function to determine the report period based on report title
  const getReportPeriod = (title: string): string => {
    const today = new Date()
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

    if (title.toLowerCase().includes('daily')) {
      return dateFormatter.format(today)
    } else if (title.toLowerCase().includes('weekly')) {
      // Calculate start of week (Sunday)
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())

      // Calculate end of week (Saturday)
      const endOfWeek = new Date(today)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return `${dateFormatter.format(startOfWeek)} - ${dateFormatter.format(
        endOfWeek,
      )}`
    } else if (title.toLowerCase().includes('monthly')) {
      // Start and end of current month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      return `${dateFormatter.format(startOfMonth)} - ${dateFormatter.format(
        endOfMonth,
      )}`
    } else if (
      title.toLowerCase().includes('yearly') ||
      title.toLowerCase().includes('annual')
    ) {
      return today.getFullYear().toString()
    } else {
      return dateFormatter.format(today)
    }
  }

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
        /* Header styling */
        .print-header {
          margin-bottom: 30px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 15px;
        }
        
        .business-info {
          margin-bottom: 10px;
        }
        
        .business-info h2 {
          font-size: 18px;
          font-weight: bold;
          margin: 0;
          color: #333;
        }
        
        .business-info p {
          font-size: 12px;
          margin: 5px 0 0;
          color: #666;
        }
        
        h1 {
          text-align: center;
          margin: 15px 0;
          color: #000;
          font-size: 24px;
        }
        
        .report-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          font-size: 12px;
          color: #666;
        }
        
        /* Footer styling */
        .print-footer {
          position: fixed;
          bottom: 20mm;
          width: calc(100% - 40mm);
          border-top: 1px solid #ddd;
          padding-top: 10px;
          margin-top: 30px;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #666;
        }
        
        .confidential {
          font-weight: bold;
        }
        
        /* Report Summary Styling */
        .report-summary {
          margin-top: 30px;
          border-top: 1px dashed #ccc;
          padding-top: 20px;
        }
        
        .summary-container {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
        }
        
        .summary-container h3 {
          margin-top: 0;
          font-size: 16px;
          margin-bottom: 10px;
          color: #333;
        }
        
        .summary-stats {
          margin: 15px 0;
        }
        
        .summary-stats ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        
        .summary-stats li {
          margin-bottom: 5px;
        }
        
        .trend-up {
          color: #22c55e;
          margin-left: 5px;
          font-size: 10px;
          white-space: nowrap;
        }
        
        .trend-down {
          color: #ef4444;
          margin-left: 5px;
          font-size: 10px;
          white-space: nowrap;
        }
        
        .report-metadata {
          background-color: #f0f0f0;
          border-radius: 4px;
          padding: 8px;
          margin: 10px 0;
          border-left: 3px solid #888;
          font-family: monospace;
        }
        
        .report-metadata p {
          margin: 3px 0;
          font-size: 9px;
          color: #555;
        }
        
        .summary-note {
          font-size: 10px;
          font-style: italic;
          color: #777;
          margin-top: 15px;
          margin-bottom: 0;
        }
        
        /* Add page numbers dynamically */
        .page-num::before {
          content: counter(page);
        }
        
        @page {
          counter-increment: page;
          @bottom-right {
            content: counter(page);
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

    // Create a header with business info, report title and date
    const header = document.createElement('div')
    header.className = 'print-header'

    // Get business profile information
    const { name: businessName, info: businessInfo } = getBusinessProfile()

    header.innerHTML = `
      <div class="business-info">
        <h2>${businessName}</h2>
        <p>${businessInfo}</p>
      </div>
      <h1>${reportTitle}</h1>
      <div class="report-meta">
        <div class="date-range">Period: ${getReportPeriod(reportTitle)}</div>
        <div class="date-printed">Generated: ${new Date().toLocaleString()}</div>
      </div>
    `

    // Create report summary section
    const reportSummary = document.createElement('div')
    reportSummary.className = 'report-summary'

    // Try to extract key statistics from the page
    const extractStatistics = () => {
      const statsContent = document.querySelectorAll(
        '.print-section .stat-value',
      )
      const stats: Record<string, string> = {}

      // Get comparison data (trends)
      const trendElements = document.querySelectorAll(
        '.print-section [class*="text-green-500"], .print-section [class*="text-red-500"]',
      )
      const trends: Record<string, { value: string; direction: string }> = {}

      statsContent.forEach(stat => {
        const label = stat.getAttribute('data-label') || ''
        const value = stat.textContent || ''
        if (label && value) {
          stats[label] = value
        }
      })

      // Extract trend data
      trendElements.forEach(trend => {
        const parentCard = trend.closest('.card')
        if (!parentCard) return

        const titleElement = parentCard.querySelector('.text-sm.font-medium')
        if (!titleElement) return

        const title = titleElement.textContent?.trim() || ''
        const trendText = trend.textContent?.trim() || ''
        const isUp =
          trend.innerHTML.includes('ArrowUpIcon') || trendText.includes('+')

        if (title) {
          trends[title] = {
            value: trendText,
            direction: isUp ? 'up' : 'down',
          }
        }
      })

      return { stats, trends }
    }

    const { stats, trends } = extractStatistics()
    const statsHtml =
      Object.keys(stats).length > 0
        ? `
        <div class="summary-stats">
          <h3>Key Metrics</h3>
          <ul>
            ${Object.entries(stats)
              .map(([label, value]) => {
                const trend = trends[label]
                const trendHtml = trend
                  ? `<span class="${
                      trend.direction === 'up' ? 'trend-up' : 'trend-down'
                    }">${trend.value}</span>`
                  : ''

                return `<li><strong>${label}:</strong> ${value} ${trendHtml}</li>`
              })
              .join('')}
          </ul>
        </div>
      `
        : ''

    // Generate timestamp and unique identifier for the report
    const timestamp = new Date().toISOString()
    const reportId = generateReportId()

    reportSummary.innerHTML = `
      <div class="summary-container">
        <h3>Report Summary</h3>
        <p>This report presents financial data for the period: ${getReportPeriod(
          reportTitle,
        )}</p>
        ${statsHtml}
        <div class="report-metadata">
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Report ID: ${reportId}</p>
          <p>Data timestamp: ${timestamp}</p>
        </div>
        <p class="summary-note">Note: This report was automatically generated. For questions or clarifications, please contact your system administrator.</p>
      </div>
    `

    // Create a footer with additional information
    const footer = document.createElement('div')
    footer.className = 'print-footer'
    footer.innerHTML = `
      <div class="footer-content">
        <div class="report-info">Report ID: ${generateReportId()}</div>
        <div class="confidential">CONFIDENTIAL - For internal use only</div>
        <div class="page-number">Page <span class="page-num"></span></div>
      </div>
    `

    // Find the print section
    const printSection = document.querySelector('.print-section')
    if (printSection) {
      // Insert header at the beginning of the print section
      printSection.insertBefore(header, printSection.firstChild)

      // Insert summary after the main content but before footer
      const chartContainer = printSection.querySelector('.chart-container')
      if (chartContainer && chartContainer.nextSibling) {
        printSection.insertBefore(reportSummary, chartContainer.nextSibling)
      } else {
        printSection.appendChild(reportSummary)
      }

      // Insert footer at the end of the print section
      printSection.appendChild(footer)
    }

    // Print the document
    window.print()

    // Remove the added elements after printing
    if (header.parentNode) {
      header.parentNode.removeChild(header)
    }

    if (reportSummary.parentNode) {
      reportSummary.parentNode.removeChild(reportSummary)
    }

    if (footer.parentNode) {
      footer.parentNode.removeChild(footer)
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
