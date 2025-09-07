import { NextRequest, NextResponse } from 'next/server';
import { getAllContactMessages } from '../../../../../../lib/database';

// GET /api/admin/contact-messages/export - Export contact messages to Excel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    // Get all messages (no pagination for export)
    const result = await getAllContactMessages({
      search,
      status,
      page: 1,
      limit: 10000 // Large limit to get all records
    });

    // Create CSV content
    const csvHeaders = ['ID', 'Name', 'Email', 'Subject', 'Message', 'Status', 'Submission Date'];
    const csvRows = result.messages.map(message => [
      message.id,
      `"${message.name}"`, // Wrap in quotes to handle commas
      message.email,
      `"${message.subject}"`, // Wrap in quotes to handle commas
      `"${message.message?.replace(/"/g, '""')}"`, // Escape quotes and wrap in quotes
      message.status,
      new Date(message.submission_date || '').toLocaleDateString()
    ]);

    // Combine headers and rows
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create response with CSV content
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="contact-messages-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error exporting contact messages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export contact messages',
        message: 'An error occurred while exporting contact messages'
      },
      { status: 500 }
    );
  }
}
