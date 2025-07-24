module.exports = (mongoose, Schema) => {
  const customerSchema = Schema({
    id: {
      type: mongoose.Schema.Types.String,
    },
    googleId: {
      type: mongoose.Schema.Types.String,
    },
    firstName: {
      type: mongoose.Schema.Types.String,
    },
    lastName: {
      type: mongoose.Schema.Types.String,
    },
    mobileNo: {
      type: mongoose.Schema.Types.String,
    },
    emailId: {
      type: mongoose.Schema.Types.String,
    },
    type: {
      type: mongoose.Schema.Types.String,
    },
    photoUrl: {
      type: mongoose.Schema.Types.String,
    },
    event: {
      type: mongoose.Schema.Types.String,
      enum: ['mahi_wedding', 'housewarming', 'birthday'],
    },
  })
  const getCustomerModelByEvent = (eventName?: string) => {
    const baseCollection = 'customers'
    const collectionName = eventName
      ? `${baseCollection}_${eventName}`
      : baseCollection

    return (
      mongoose.models[collectionName] ||
      mongoose.model(collectionName, customerSchema, collectionName)
    )
  }

  return { getCustomerModelByEvent }
}
