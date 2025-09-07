import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllContactMessages, 
  createContactMessage, 
  updateContactMessageStatus, 
  deleteContactMessage 
} from '../../../../../lib/database';

// GET /api/admin/contact-messages - Get all contact messages with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await getAllContactMessages({
      search,
      status,
      page,
      limit
    });

    console.log('📧 Admin API: Retrieved contact messages', { total: result.total, count: result.messages.length });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Contact messages retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contact messages',
        message: 'An error occurred while retrieving contact messages'
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/contact-messages - Create new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'All fields are required',
          message: 'Please provide name, email, subject, and message'
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

    const contactMessage = await createContactMessage({
      name,
      email,
      subject,
      message
    });

    if (!contactMessage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create contact message',
          message: 'An error occurred while saving the contact message'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contactMessage,
      message: 'Contact message created successfully'
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create contact message',
        message: 'An error occurred while creating the contact message'
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/contact-messages - Update message status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID and status are required',
          message: 'Please provide message ID and status'
        },
        { status: 400 }
      );
    }

    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status',
          message: 'Status must be "new", "read", or "replied"'
        },
        { status: 400 }
      );
    }

    const success = await updateContactMessageStatus(id, status);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update message',
          message: 'Message not found or update failed'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact message status updated successfully'
    });
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update contact message',
        message: 'An error occurred while updating the contact message'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/contact-messages - Delete message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID is required',
          message: 'Please provide message ID'
        },
        { status: 400 }
      );
    }

    const success = await deleteContactMessage(parseInt(id));

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete message',
          message: 'Message not found or deletion failed'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete contact message',
        message: 'An error occurred while deleting the contact message'
      },
      { status: 500 }
    );
  }
}
