import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function POST(request: NextRequest) {
  try {
    // Get the current session to verify user is authenticated
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    if (session?.user?.email_verified){
      return NextResponse.json({message: "Email already verified"}, { status: 200 }); 
    }
    // Get the user ID from the session
    const userId = session.user?.sub;
    if (!userId) {
      return NextResponse.json({ error: "user_id_not_found" }, { status: 400 });
    }

    // Get the Auth0 domain from environment variables
    const auth0Domain = process.env.AUTH0_DOMAIN;
    if (!auth0Domain) {
      return NextResponse.json({ error: "auth0_domain_not_configured" }, { status: 500 });
    }

    // Get the Management API access token
    const accessToken = await auth0.getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: "access_token_not_found" }, { status: 500 });
    }

    // Call Auth0 Management API to send verification email
    const response = await fetch(`https://${auth0Domain}/api/v2/jobs/verification-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Auth0 API error:', errorData);
      return NextResponse.json({ 
        error: "failed_to_send_verification_email",
        details: errorData 
      }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json({ 
      success: true, 
      message: "Verification email sent successfully",
      jobId: result.id 
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ 
      error: "internal_server_error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}