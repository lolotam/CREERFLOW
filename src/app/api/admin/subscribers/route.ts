import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllEmailSubscribers, 
  createEmailSubscriber, 
  updateEmailSubscriberStatus, 
  deleteEmailSubscriber 
} from '../../../../../lib/database';

// GET /api/admin/subscribers - Get all email subscribers with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await getAllEmailSubscribers({
      search,
      status,
      page,
      limit
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Email subscribers retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching email subscribers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch email subscribers',
        message: 'An error occurred while retrieving email subscribers'
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/subscribers - Create new email subscriber
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
          message: 'Please provide an email address'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
          message: 'Please provide a valid email address'
        },
        { status: 400 }
      );
    }

    const subscriber = await createEmailSubscriber(email);

    if (!subscriber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create subscriber',
          message: 'Email may already be subscribed'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subscriber,
      message: 'Email subscriber created successfully'
    });
  } catch (error) {
    console.error('Error creating email subscriber:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create email subscriber',
        message: 'An error occurred while creating the email subscriber'
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/subscribers - Update subscriber status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID and status are required',
          message: 'Please provide subscriber ID and status'
        },
        { status: 400 }
      );
    }

    if (!['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status',
          message: 'Status must be either "active" or "inactive"'
        },
        { status: 400 }
      );
    }

    const success = await updateEmailSubscriberStatus(id, status);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update subscriber',
          message: 'Subscriber not found or update failed'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email subscriber status updated successfully'
    });
  } catch (error) {
    console.error('Error updating email subscriber:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update email subscriber',
        message: 'An error occurred while updating the email subscriber'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/subscribers - Delete subscriber
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID is required',
          message: 'Please provide subscriber ID'
        },
        { status: 400 }
      );
    }

    const success = await deleteEmailSubscriber(parseInt(id));

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete subscriber',
          message: 'Subscriber not found or deletion failed'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email subscriber deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting email subscriber:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete email subscriber',
        message: 'An error occurred while deleting the email subscriber'
      },
      { status: 500 }
    );
  }
}
