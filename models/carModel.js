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
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    maxlength: [10, 'Price cannot be more than 1,00,00,00,000'],
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
  verified: {
    type: Boolean,
    default: false,
  },
  ratings: {
      type: Number,
      default: 0,
  },
  reviews: [
      {
          user: {
              type: mongoose.Schema.ObjectId,
              ref: 'User',
              required: true,
          },
          name: {
              type: String,
              required: true,
          },
          rating: {
              type: Number,
              required: true,
          },
          comment: {
              type: String,
              required: true,
          },
      },
  ],
  numOfReviews: {
      type: Number,
      default: 0,
  },
});

export default mongoose.models.Car || mongoose.model('Car', carSchema);
