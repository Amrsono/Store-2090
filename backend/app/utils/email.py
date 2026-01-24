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
    print(f"\nHi {username},")
    print(f"\nWelcome to the Cyberpunk Store! Please verify your email address by clicking the link below:")
    print(f"\n{verification_url}")
    print(f"\nThis link will expire in 24 hours.")
    print(f"\nIf you didn't create this account, please ignore this email.")
    print("\n" + "="*80 + "\n")
    
    # In production, add actual email sending logic here
    # Example with SendGrid:
    # from sendgrid import SendGridAPIClient
    # from sendgrid.helpers.mail import Mail
    # message = Mail(from_email='noreply@cyberpunk-store.com', 
    #                to_emails=email,
    #                subject='Verify your email',
    #                html_content=f'<a href="{verification_url}">Verify Email</a>')
    # sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    # response = sg.send(message)
    
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
