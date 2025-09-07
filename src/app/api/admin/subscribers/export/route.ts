import { NextRequest, NextResponse } from 'next/server';
import { getAllEmailSubscribers } from '../../../../../../lib/database';

// GET /api/admin/subscribers/export - Export email subscribers to Excel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    // Get all subscribers (no pagination for export)
    const result = await getAllEmailSubscribers({
      search,
      status,
      page: 1,
      limit: 10000 // Large limit to get all records
    });

    // Create CSV content
    const csvHeaders = ['ID', 'Email', 'Status', 'Subscription Date'];
    const csvRows = result.subscribers.map(subscriber => [
      subscriber.id,
      subscriber.email,
      subscriber.status,
      new Date(subscriber.subscription_date || '').toLocaleDateString()
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
        'Content-Disposition': `attachment; filename="email-subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error exporting email subscribers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export email subscribers',
        message: 'An error occurred while exporting email subscribers'
      },
      { status: 500 }
    );
  }
}
