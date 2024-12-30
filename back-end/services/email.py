from flask_mail import Mail, Message
from flask import render_template

class EmailService:
    def __init__(self) -> None:
        self.mail = Mail()

    def send_email(self, subject: str, recipients: list[str], body_html: str):
        msg = Message(subject, recipients=recipients)
        msg.html = body_html
        self.mail.send(msg)

    def send_verification_email(self, email: str, action_url: str):
        subject = "[UTE CHESS CLUB] Verification"
        html = render_template('email/verification_email.html', action_url=action_url)
        self.send_email(subject=subject, recipients=[email], body_html=html)

    def send_reset_password_email(self, email: str, action_url: str):
        subject = "[UTE CHESS CLUB] Reset password"
        html = render_template('email/reset_password.html', action_url=action_url)
        self.send_email(subject=subject, recipients=[email], body_html=html)
        
    def send_new_password_email(self, email: str, password: str):
        subject = "[UTE CHESS CLUB] New password reset"
        html = render_template('email/new_password.html', password=password)
        self.send_email(subject=subject, recipients=[email], body_html=html)

        