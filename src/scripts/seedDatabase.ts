import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Astrologer from '../models/Astrologer';
import Service from '../models/Service';
import connectDB from '../config/database';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Astrologer.deleteMany({}),
      Service.deleteMany({})
    ]);

    // Create sample services
    const services = await Service.insertMany([
      {
        name: 'Career Guidance',
        icon: '💼',
        duration: 45,
        description: 'Professional growth and career decisions',
        basePrice: 1000,
        isActive: true
      },
      {
        name: 'Marriage & Relationships',
        icon: '💝',
        duration: 60,
        description: 'Love, compatibility and marriage timing',
        basePrice: 1200,
        isActive: true
      },
      {
        name: 'Health & Wellness',
        icon: '🏥',
        duration: 45,
        description: 'Health predictions and remedies',
        basePrice: 1100,
        isActive: true
      },
      {
        name: 'Business Consultation',
        icon: '📈',
        duration: 60,
        description: 'Business growth and financial guidance',
        basePrice: 1500,
        isActive: true
      },
      {
        name: 'Education & Studies',
        icon: '📚',
        duration: 40,
        description: 'Academic success and study guidance',
        basePrice: 900,
        isActive: true
      },
      {
        name: 'Gemstone Consultation',
        icon: '💎',
        duration: 30,
        description: 'Gemstone recommendations and benefits',
        basePrice: 800,
        isActive: true
      }
    ]);

    // Create sample users (astrologers)
    const users = await User.insertMany([
      {
        name: 'Pandit Raj Sharma',
        email: 'raj.sharma@example.com',
        phone: '+919876543210',
        birthDate: new Date('1970-05-15'),
        birthTime: '10:30',
        birthPlace: 'Varanasi, UP, India',
        password: 'password123',
        role: 'astrologer'
      },
      {
        name: 'Dr. Priya Joshi',
        email: 'priya.joshi@example.com',
        phone: '+919876543211',
        birthDate: new Date('1980-08-22'),
        birthTime: '14:15',
        birthPlace: 'Mumbai, MH, India',
        password: 'password123',
        role: 'astrologer'
      },
      {
        name: 'Acharya Kumar Das',
        email: 'kumar.das@example.com',
        phone: '+919876543212',
        birthDate: new Date('1965-12-10'),
        birthTime: '06:45',
        birthPlace: 'Kolkata, WB, India',
        password: 'password123',
        role: 'astrologer'
      }
    ]);

    // Create sample astrologers
    const astrologers = await Astrologer.insertMany([
      {
        userId: users[0]._id,
        name: 'Pandit Raj Sharma',
        specialization: 'Vedic Astrology',
        experience: '25+ years',
        rating: 4.9,
        consultations: 2500,
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
        price: 1500,
        available: true,
        bio: 'Renowned Vedic astrologer with over 25 years of experience in horoscope reading and life guidance.',
        languages: ['Hindi', 'English', 'Sanskrit'],
        timeSlots: [
          { time: '09:00', available: true },
          { time: '10:00', available: false },
          { time: '11:00', available: true },
          { time: '14:00', available: true },
          { time: '15:00', available: true },
          { time: '16:00', available: false },
          { time: '17:00', available: true },
          { time: '18:00', available: true }
        ]
      },
      {
        userId: users[1]._id,
        name: 'Dr. Priya Joshi',
        specialization: 'Numerology & Palmistry',
        experience: '15+ years',
        rating: 4.8,
        consultations: 1800,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        price: 1200,
        available: true,
        bio: 'Expert in numerology and palmistry with a scientific approach to astrology.',
        languages: ['Hindi', 'English', 'Marathi'],
        timeSlots: [
          { time: '09:00', available: true },
          { time: '10:00', available: true },
          { time: '11:00', available: false },
          { time: '14:00', available: true },
          { time: '15:00', available: true },
          { time: '16:00', available: true },
          { time: '17:00', available: false },
          { time: '18:00', available: true }
        ]
      },
      {
        userId: users[2]._id,
        name: 'Acharya Kumar Das',
        specialization: 'Gemstone Therapy',
        experience: '30+ years',
        rating: 4.9,
        consultations: 3200,
        image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
        price: 2000,
        available: false,
        bio: 'Master of gemstone therapy and Tantric astrology with three decades of practice.',
        languages: ['Hindi', 'English', 'Bengali'],
        timeSlots: [
          { time: '09:00', available: false },
          { time: '10:00', available: false },
          { time: '11:00', available: false },
          { time: '14:00', available: false },
          { time: '15:00', available: false },
          { time: '16:00', available: false },
          { time: '17:00', available: false },
          { time: '18:00', available: false }
        ]
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${astrologers.length} astrologers`);
    console.log(`Created ${services.length} services`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData(