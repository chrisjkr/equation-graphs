import mongoose from 'mongoose'
const Schema = mongoose.Schema

const Function = new Schema({
  type: { type: String, required: true },
  a: { type: Number },
  b: { type: Number },
  c: { type: Number },
  d: { type: Number },
  x: { type: Number },
  x2: { type: Number },
  x3: { type: Number },
  hasRoots: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
})

export default mongoose.model('function', Function)
