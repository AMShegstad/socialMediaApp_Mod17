import mongoose from 'mongoose';
import User from '../models/user.js';
import Thought from '../models/thought.js';
import Reaction from '../models/reaction.js';
import {users, thoughts} from './data.js'; // Adjust the path to your data.js file if necessary

const seedDatabase = async () => {
    try {
        // Connect to your MongoDB database
        await mongoose.connect('mongodb://127.0.0.1:27017/socialMediaApp', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Database connected!');

        // Clear existing data
        await User.deleteMany({});
        await Thought.deleteMany({});

        console.log('Existing data cleared!');

        // Insert seed data
        await User.insertMany(users);
        await Thought.insertMany(thoughts);

        console.log('Seed data added successfully!');

        // Close the database connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding the database:', error);
        mongoose.connection.close();
    }
};

seedDatabase();