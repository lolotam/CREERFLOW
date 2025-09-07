import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const applicationData = {
      // Personal Information
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipCode: formData.get('zipCode') as string,
      
      // Experience
      currentPosition: formData.get('currentPosition') as string,
      currentCompany: formData.get('currentCompany') as string,
      yearsExperience: formData.get('yearsExperience') as string,
      education: formData.get('education') as string,
      skills: JSON.parse(formData.get('skills') as string || '[]'),
      certifications: JSON.parse(formData.get('certifications') as string || '[]'),
      
      // Additional Information
      availableStartDate: formData.get('availableStartDate') as string,
      salaryExpectation: formData.get('salaryExpectation') as string,
      additionalInfo: formData.get('additionalInfo') as string,
      
      // Job Information
      jobId: formData.get('jobId') as string,
      
      // Submission metadata
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    };

    // Extract files
    const resume = formData.get('resume') as File | null;
    const coverLetter = formData.get('coverLetter') as File | null;
    const portfolio = formData.get('portfolio') as File | null;

    // Log the application data (in production, save to database)
    console.log('New Application Received:', {
      applicant: `${applicationData.firstName} ${applicationData.lastName}`,
      email: applicationData.email,
      position: applicationData.currentPosition,
      jobId: applicationData.jobId,
      submittedAt: applicationData.submittedAt,
      hasResume: !!resume,
      hasCoverLetter: !!coverLetter,
      hasPortfolio: !!portfolio,
    });

    // In a real application, you would:
    // 1. Save application data to database
    // 2. Upload files to cloud storage (AWS S3, Google Cloud Storage, etc.)
    // 3. Send confirmation email to applicant
    // 4. Send notification email to HR team
    // 5. Integrate with ATS (Applicant Tracking System)

    // Example database save (pseudo-code):
    // const application = await db.applications.create({
    //   data: {
    //     ...applicationData,
    //     resumeUrl: resume ? await uploadFile(resume) : null,
    //     coverLetterUrl: coverLetter ? await uploadFile(coverLetter) : null,
    //     portfolioUrl: portfolio ? await uploadFile(portfolio) : null,
    //   }
    // });

    // Example email notification (pseudo-code):
    // await sendEmail({
    //   to: applicationData.email,
    //   subject: 'Application Received - CareerFlow',
    //   template: 'application-confirmation',
    //   data: applicationData
    // });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: `CF-${Date.now()}`, // Generate a proper ID in production
      data: {
        applicantName: `${applicationData.firstName} ${applicationData.lastName}`,
        email: applicationData.email,
        submittedAt: applicationData.submittedAt,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Application submission error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to submit application',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
