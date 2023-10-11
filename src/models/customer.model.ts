module.exports = (mongoose, Schema) =>
{
    const customerSchema = Schema({
        id: {
            type: mongoose.Schema.Types.String,

        },
        googleId: {
            type: mongoose.Schema.Types.String
        },
        firstName: {
            type: mongoose.Schema.Types.String
        },
        lastName: {
            type: mongoose.Schema.Types.String
        },
        mobileNo: {
            type: mongoose.Schema.Types.String
        },
        emailId: {
            type: mongoose.Schema.Types.String
        },
        type: {
            type: mongoose.Schema.Types.String
        },
        photoUrl: {
            type: mongoose.Schema.Types.String
        },

    })
    const customer = mongoose.model('customers', customerSchema);
    return customer;
}