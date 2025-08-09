import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendConsultationConfirmation = async (
  email: string,
  name: string,
  consultationDetails: any
) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Consultation Booking Confirmed',
    html: `
      <h2>Dear ${name},</h2>
      <p>Your consultation has been confirmed!</p>
      <div>
        <h3>Consultation Details:</h3>
        <p><strong>Astrologer:</strong> ${consultationDetails.astrologerName}</p>
        <p><strong>Service:</strong> ${consultationDetails.serviceName}</p>
        <p><strong>Date:</strong> ${consultationDetails.date}</p>
        <p><strong>Time:</strong> ${consultationDetails.time}</p>
        <p><strong>Duration:</strong> ${consultationDetails.duration} minutes</p>
      </div>
      <p>We'll send you the meeting link closer to your consultation time.</p>
      <p>Thank you for choosing our services!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
};

export const sendConsultationReminder = async (
  email: string,
  name: string,
  consultationDetails: any
) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Consultation Reminder - Tomorrow',
    html: `
      <h2>Dear ${name},</h2>
      <p>This is a reminder that your consultation is scheduled for tomorrow.</p>
      <div>
        <h3>Consultation Details:</h3>
        <p><strong>Astrologer:</strong> ${consultationDetails.astrologerName}</p>
        <p><strong>Date:</strong> ${consultationDetails.date}</p>
        <p><strong>Time:</strong> ${consultationDetails.time}</p>
        <p><strong>Meeting Link:</strong> <a href="${consultationDetails.meetingLink}">Join Meeting</a></p>
      </div>
      <p>Please ensure you have a stable internet connection for the best experience.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reminder email sent successfully');
  } catch (error) {
    console.error('Failed to send reminder email:', error);
  }
};
