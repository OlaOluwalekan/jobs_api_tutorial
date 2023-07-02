const { Schema, model, Types } = require('mongoose')

const JobSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlenght: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlenght: 50,
    },
    status: {
      type: String,
      enum: ['interview', 'decline', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

module.exports = model('Job', JobSchema)
