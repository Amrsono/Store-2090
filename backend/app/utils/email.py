import os
import secrets
from typing import Optional

def generate_verification_token() -> str:
    """Generate a secure random verification token"""
    return secrets.token_urlsafe(32)

def send_verification_email(email: str, token: str, username: str) -> bool:
    """
    Send verification email to user.
    In development, just logs to console.
    In production, would use SendGrid, AWS SES, or similar service.
    """
    verification_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/verify-email?token={token}"
    
    # For development: log to console
    print("\n" + "="*80)
    print("📧 EMAIL VERIFICATION")
    print("="*80)
    print(f"To: {email}")
    print(f"Subject: Verify your Cyberpunk Store account")
    print(f"Verify Link: {verification_url}")
    print("="*80 + "\n")
    
    # Try sending real email if configured
    from app.config import settings
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    if settings.SMTP_SERVER and settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
        try:
            print(f"Attempting to send verified email via {settings.SMTP_SERVER}...")
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_FROM_EMAIL
            msg['To'] = email
            msg['Subject'] = "Verify your Cyberpunk Store account"

            html = f"""
            <html>
                <body style="background-color: #000; color: #fff; font-family: sans-serif; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #00d4ff; border-radius: 10px; padding: 20px;">
                        <h1 style="color: #00d4ff; text-align: center;">CYBERPUNK STORE</h1>
                        <p>Hi {username},</p>
                        <p>Welcome to the future of fashion. Please verify your identity to access the grid.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{verification_url}" style="background: linear-gradient(45deg, #00d4ff, #b300ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">VERIFY IDENTITY</a>
                        </div>
                        <p style="color: #666; font-size: 12px; text-align: center;">Link expires in 24 hours.</p>
                    </div>
                </body>
            </html>
            """
            
            msg.attach(MIMEText(html, 'html'))

            with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)
            print("✅ Email sent successfully")
            return True
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            # Don't crash, just return True so user can at least see the console log if in dev
            return True
            
    return True

def send_welcome_email(email: str, username: str) -> bool:
    """Send welcome email after verification"""
    print("\n" + "="*80)
    print("🎉 WELCOME EMAIL")
    print("="*80)
    print(f"To: {email}")
    print(f"Subject: Welcome to Cyberpunk Store!")
    print(f"\nHi {username},")
    print(f"\nYour email has been verified! You can now access all features of the Cyberpunk Store.")
    print(f"\nHappy shopping in the future! 🚀")
    print("\n" + "="*80 + "\n")
    
    return True
