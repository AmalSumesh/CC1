/**
 * Database Seed Script
 * Run this script to populate the database with sample data
 * 
 * Usage: node scripts/seed.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Driver from '../models/Driver.js';
import Dustbin from '../models/Dustbin.js';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Admin.deleteMany({});
    await Driver.deleteMany({});
    await Dustbin.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create sample admin
    const admin = await Admin.create({
      name: 'System Admin',
      username: 'admin',
      password: 'admin123' // In production, hash this!
    });
    console.log('✓ Created admin account');

    // Create sample dustbins in Bangalore
    const dustbins = await Dustbin.insertMany([
      {
        binCode: 'BIN-001',
        location: { lat: 12.9352, lng: 77.6245 },
        fillLevel: 85,
        priority: 3
      },
      {
        binCode: 'BIN-002',
        location: { lat: 12.9389, lng: 77.6050 },
        fillLevel: 60,
        priority: 2
      },
      {
        binCode: 'BIN-003',
        location: { lat: 12.9719, lng: 77.5937 },
        fillLevel: 95,
        priority: 5
      },
      {
        binCode: 'BIN-004',
        location: { lat: 12.9520, lng: 77.6009 },
        fillLevel: 40,
        priority: 1
      },
      {
        binCode: 'BIN-005',
        location: { lat: 12.9716, lng: 77.5946 },
        fillLevel: 75,
        priority: 3
      },
      {
        binCode: 'BIN-006',
        location: { lat: 12.9784, lng: 77.6408 },
        fillLevel: 50,
        priority: 2
      },
      {
        binCode: 'BIN-007',
        location: { lat: 12.9355, lng: 77.6245 },
        fillLevel: 88,
        priority: 4
      },
      {
        binCode: 'BIN-008',
        location: { lat: 12.9298, lng: 77.6345 },
        fillLevel: 65,
        priority: 2
      }
    ]);
    console.log('✓ Created 8 sample dustbins');

    // Create sample drivers with assigned bins
    const driver1 = await Driver.create({
      name: 'Raj Kumar',
      username: 'driver1',
      password: 'driver123',
      assignedBins: [dustbins[0]._id, dustbins[1]._id, dustbins[3]._id]
    });
    console.log('✓ Created driver1 (assigned 3 bins)');

    const driver2 = await Driver.create({
      name: 'Priya Singh',
      username: 'driver2',
      password: 'driver123',
      assignedBins: [dustbins[2]._id, dustbins[4]._id, dustbins[5]._id, dustbins[6]._id]
    });
    console.log('✓ Created driver2 (assigned 4 bins)');

    const driver3 = await Driver.create({
      name: 'Ahmed Hassan',
      username: 'driver3',
      password: 'driver123',
      assignedBins: [dustbins[7]._id]
    });
    console.log('✓ Created driver3 (assigned 1 bin)');

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('Sample Login Credentials:');
    console.log('├─ Admin: username=admin, password=admin123');
    console.log('├─ Driver 1: username=driver1, password=driver123');
    console.log('├─ Driver 2: username=driver2, password=driver123');
    console.log('└─ Driver 3: username=driver3, password=driver123\n');

  } catch (error) {
    console.error('✗ Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed');
  }
};

// Run seeding
connectToDatabase().then(() => seedDatabase());
