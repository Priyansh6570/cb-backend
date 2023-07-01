import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
    maxlength: [50, 'Company name cannot be more than 50 characters'],
  },
  model: {
    type: String,
    required: [true, 'Please provide a car model name'],
    trim: true,
  },
  varient: {
    type: String,
    required: [true, 'Please provide a car varient'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Please provide car year'],
  },
  Km_Driven: {
    type: Number,
    required: [true, 'Please provide car Km_Driven'],
  },
  fuel: {
    type: String,
    required: [true, 'Please provide car fuel_type'],
  },
  transmission: {
    type: String,
    required: [true, 'Please provide car transmission'],
  },
  color: {
    type: String,
    required: [true, 'Please provide car color'],
  },
  no_of_owners: {
    type: Number,
    required: [true, 'Please provide car no_of_owners'],
  },
  RTO: {
    type: String,
    required: [true, 'Please provide car RTO']
  },
  city: {
    type: String,
    required: [true, 'Please provide a city'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    maxlength: [10, 'Price cannot be more than 10Crore'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  image: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'Please select a category for car'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  showMobile: {
    type: Boolean,
    default: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Car || mongoose.model('Car', carSchema);
