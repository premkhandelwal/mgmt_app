import { Mongoose } from "mongoose"

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
  })
  const payment = mongoose.model('payment', paymentSchema)
  return payment
}
