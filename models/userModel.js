import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [30, 'Your name cannot exceed 30 characters'],
    minLength: [4, 'Name must be at least 4 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [8, 'Your password must be at least 8 characters'],
    select: false,
  },
  mobile: {
    type: String,
    required: [true, 'Please enter your mobile number'],
    maxLength: [10, 'Your mobile number cannot exceed 10 characters'],
    minLength: [10, 'Your mobile number must be at least 10 characters'],
  },

  address: {
    type: String,
  },

  dealershipName : {
    type: String,
  },

  tagLine : {
    type: String,
  },

  city : {
    type: String,
  },

  planType : {
    type: String,
  },

  avatar: [
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
  role: {
    type: String,
    default: 'user',
  },

  credit: {
    type: Number,
    default: 1,
  },

  expireLimit: {
    type : Number,
    default : 30,
  },

  wishList: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Car',
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Encrypting password before saving user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hashing and setting to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    // Setting token expire time
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    
    return resetToken;
  }
  
  export default mongoose.models.User || mongoose.model('User', userSchema);
