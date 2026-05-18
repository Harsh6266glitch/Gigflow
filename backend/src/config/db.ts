import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI as string;
    
    try {
      // First try to connect to the real MongoDB
      console.log('🔄 Attempting to connect to MongoDB...');
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 2000 // Quick timeout to fail fast if not running
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (realMongoError) {
      console.log('⚠️ Failed to connect to real MongoDB, falling back to In-Memory MongoDB...');
      
      // Fallback to In-Memory MongoDB
      mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      
      await mongoose.connect(inMemoryUri);
      console.log(`✅ In-Memory MongoDB Connected: ${inMemoryUri}`);
      
      // Seed the database if it's in-memory (since it starts empty)
      console.log('🌱 Seeding In-Memory Database...');
      await seedInMemoryDatabase();
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', (error as Error).message);
    process.exit(1);
  }
};

async function seedInMemoryDatabase() {
  const { User } = require('../models/user.model');
  const { Lead } = require('../models/lead.model');

  // Check if already seeded (just in case)
  const count = await User.countDocuments();
  if (count > 0) return;

  const users = [
    { name: 'Admin User', email: 'admin@gigflow.com', password: 'Admin@123', role: 'Admin' },
    { name: 'Sarah Johnson', email: 'sarah@gigflow.com', password: 'Sales@123', role: 'Sales User' },
    { name: 'Mike Chen', email: 'mike@gigflow.com', password: 'Sales@123', role: 'Sales User' },
  ];

  const leadNames = [
    'Rahul Sharma', 'Priya Patel', 'Arjun Singh', 'Nisha Verma', 'Vikram Khanna',
    'Anjali Rao', 'Deepak Gupta', 'Kavita Nair', 'Suresh Kumar', 'Meera Joshi',
    'Amit Tiwari', 'Pooja Desai', 'Ravi Malhotra', 'Sneha Reddy', 'Kiran Bhat',
    'Ananya Das', 'Rohit Mehta', 'Divya Pillai', 'Arun Nambiar', 'Isha Pandey',
  ];

  const statuses = ['New', 'Contacted', 'Qualified', 'Lost'];
  const sources = ['Website', 'Instagram', 'Referral'];
  const notes = [
    'Interested in premium plan', 'Follow up next week', 'Very promising lead',
    'Budget constraints mentioned', 'Requested demo call', 'Referral from existing client',
    null, null, null,
  ];

  const createdUsers = await User.create(users);
  console.log(`👥 Created ${createdUsers.length} users`);

  const adminUser = createdUsers[0];
  const salesUsers = createdUsers.slice(1);

  const leadsData = leadNames.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    status: statuses[i % statuses.length],
    source: sources[i % sources.length],
    notes: notes[i % notes.length] || undefined,
    createdBy: i % 3 === 0 ? adminUser._id : salesUsers[i % salesUsers.length]._id,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  }));

  await Lead.create(leadsData);
  console.log(`📋 Created ${leadsData.length} leads`);
  console.log('🎉 In-Memory Seed completed!');
}
