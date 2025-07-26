import { Mongoose } from 'mongoose'

module.exports = (mongoose: Mongoose, Schema) => {
  const paymentSchema = Schema({
    paidBy: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    paidTo: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    amount: {
      type: mongoose.Schema.Types.Number,
    },
    date: {
      type: mongoose.Schema.Types.String,
    },
    paidFor: {
      type: mongoose.Schema.Types.String,
    },
    event: {
      type: String,
      enum: ['mahi_wedding', 'housewarming', 'birthday'],
      default: undefined,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    updatedOn: {
      type: Date,
    },
    updatedBy: {
      type: String,
    },
  })

  const getPaymentModelByEvent = (eventName?: string) => {
    const baseCollection = 'payments'
    const collectionName = eventName ? `${baseCollection}_${eventName}` : baseCollection

    return (
      mongoose.models[collectionName] ||
      mongoose.model(collectionName, paymentSchema, collectionName)
    )
  }

  return { getPaymentModelByEvent }
}
