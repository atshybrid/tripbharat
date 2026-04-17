const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const createTransporter = () => {
  const service = process.env.EMAIL_SERVICE || 'gmail';
  
  if (service === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else if (service === 'sendgrid') {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else {
    // Generic SMTP
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
};

const transporter = createTransporter();

// Send email function
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email sending failed: ${error.message}`);
    throw error;
  }
};

// Welcome email
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to SK ToursiQ!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4a5568;">Welcome to SK ToursiQ!</h1>
      <p>Hi ${user.name},</p>
      <p>Thank you for joining SK ToursiQ. We're excited to have you on board!</p>
      <p>Your referral code is: <strong>${user.referralCode}</strong></p>
      <p>Share this code with your friends and earn ₹${process.env.REFERRAL_REWARD_AMOUNT || 500} when they make their first booking!</p>
      <p>Start exploring amazing travel packages now!</p>
      <a href="${process.env.FRONTEND_URL}/packages" style="display: inline-block; padding: 10px 20px; background-color: #4299e1; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Browse Packages</a>
      <p style="margin-top: 30px; color: #718096; font-size: 14px;">Best regards,<br>SK ToursiQ Team</p>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject,
    html
  });
};

// Booking confirmation email
const sendBookingConfirmation = async (user, booking) => {
  const subject = `Booking Confirmed - ${booking.bookingNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #48bb78;">Booking Confirmed!</h1>
      <p>Hi ${user.name},</p>
      <p>Your booking has been confirmed successfully!</p>
      
      <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Booking Details</h3>
        <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
        <p><strong>Package:</strong> ${booking.packageName}</p>
        <p><strong>Destination:</strong> ${booking.destination}</p>
        <p><strong>Travel Date:</strong> ${new Date(booking.travelDate).toLocaleDateString()}</p>
        <p><strong>Number of Travelers:</strong> ${booking.numberOfTravelers}</p>
        <p><strong>Total Amount:</strong> ₹${booking.pricing.totalAmount}</p>
      </div>
      
      <p>Your booking voucher is attached to this email. Please carry it with you during your trip.</p>
      
      <p style="margin-top: 30px; color: #718096; font-size: 14px;">
        For any queries, contact us at ${process.env.COMPANY_EMAIL}<br>
        Best regards,<br>SK ToursiQ Team
      </p>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject,
    html
  });
};

// Password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4a5568;">Password Reset Request</h1>
      <p>Hi ${user.name},</p>
      <p>You requested to reset your password. Click the button below to reset it:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4299e1; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p style="margin-top: 30px; color: #718096; font-size: 14px;">Best regards,<br>SK ToursiQ Team</p>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject,
    html
  });
};

// Get-Together invite email
const sendGetTogetherInvite = async (participant, trip, creator) => {
  const inviteUrl = `${process.env.FRONTEND_URL}/get-together/join/${trip.inviteCode}`;
  
  const subject = `You're invited to "${trip.title}" by ${creator.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4299e1;">You're Invited to a Group Trip!</h1>
      <p>Hi ${participant.name},</p>
      <p>${creator.name} has invited you to join a group trip!</p>
      
      <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${trip.title}</h3>
        ${trip.description ? `<p>${trip.description}</p>` : ''}
        ${trip.destination ? `<p><strong>Destination:</strong> ${trip.destination}</p>` : ''}
        ${trip.totalBudget ? `<p><strong>Budget:</strong> ₹${trip.totalBudget}</p>` : ''}
      </div>
      
      <p>Join the trip and help plan your perfect vacation together!</p>
      <a href="${inviteUrl}" style="display: inline-block; padding: 10px 20px; background-color: #48bb78; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">Join Trip</a>
      
      <p style="margin-top: 30px; color: #718096; font-size: 14px;">Best regards,<br>SK ToursiQ Team</p>
    </div>
  `;
  
  return sendEmail({
    to: participant.email,
    subject,
    html
  });
};

// Referral reward email
const sendReferralRewardEmail = async (user, amount) => {
  const subject = `You've earned ₹${amount} referral reward!`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #48bb78;">Congratulations!</h1>
      <p>Hi ${user.name},</p>
      <p>Great news! Your referral has made their first booking.</p>
      <p>We've credited <strong>₹${amount}</strong> to your wallet!</p>
      <p>Keep sharing your referral code <strong>${user.referralCode}</strong> and earn more rewards!</p>
      <a href="${process.env.FRONTEND_URL}/wallet" style="display: inline-block; padding: 10px 20px; background-color: #4299e1; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">View Wallet</a>
      <p style="margin-top: 30px; color: #718096; font-size: 14px;">Best regards,<br>SK ToursiQ Team</p>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject,
    html
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendBookingConfirmation,
  sendPasswordResetEmail,
  sendGetTogetherInvite,
  sendReferralRewardEmail
};
