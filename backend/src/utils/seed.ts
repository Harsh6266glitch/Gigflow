import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { Lead } from '../models/lead.model';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gigflow';

const users = [
  { name: 'Admin User', email: 'admin@gigflow.com', password: 'Admin@123', role: 'Admin' as const },
  { name: 'Sarah Johnson', email: 'sarah@gigflow.com', password: 'Sales@123', role: 'Sales User' as const },
  { name: 'Mike Chen', email: 'mike@gigflow.com', password: 'Sales@123', role: 'Sales User' as const },
];

const leadNames = [
  'Rahul Sharma', 'Priya Patel', 'Arjun Singh', 'Nisha Verma', 'Vikram Khanna',
  'Anjali Rao', 'Deepak Gupta', 'Kavita Nair', 'Suresh Kumar', 'Meera Joshi',
  'Amit Tiwari', 'Pooja Desai', 'Ravi Malhotra', 'Sneha Reddy', 'Kiran Bhat',
  'Ananya Das', 'Rohit Mehta', 'Divya Pillai', 'Arun Nambiar', 'Isha Pandey',
];

const statuses: Array<'New' | 'Contacted' | 'Qualified' | 'Lost'> = ['New', 'Contacted', 'Qualified', 'Lost'];
const sources: Array<'Website' | 'Instagram' | 'Referral'> = ['Website', 'Instagram', 'Referral'];
const notes = [
  'Interested in premium plan', 'Follow up next week', 'Very promising lead',
  'Budget constraints mentioned', 'Requested demo call', 'Referral from existing client',
  null, null, null,
];

const seed = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('🗑️  Cleared existing data');

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

    console.log('\n🎉 Seed completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Login credentials:');
    console.log('   Admin  → admin@gigflow.com / Admin@123');
    console.log('   Sales  → sarah@gigflow.com / Sales@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
