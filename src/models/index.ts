const mongoose = require('mongoose')
const { Schema } = mongoose
const CustomerModel = require('./customer.model')
const PaymentModel = require('./payment.model')

const Db: any = {}

Db.customer = CustomerModel(mongoose, Schema)
Db.payment = PaymentModel(mongoose, Schema)

module.exports = Db
