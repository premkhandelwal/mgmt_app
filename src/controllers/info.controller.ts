import { Request, Response } from 'express'
import { Model } from 'mongoose'

const db = require('../models/index')
const { getPaymentModelByEvent } = db.payment
const Customer: Model<any> = db.customer

async function generateUniqueId(paymentModel: Model<any>) {
  const count = await paymentModel.countDocuments()
  const sixDigitId = (count + 1).toString().padStart(6, '0')
  return sixDigitId
}

async function addPayment(req: Request, res: Response) {
  try {
    const event = req.body.event || null
    const PaymentModel = getPaymentModelByEvent(event)
    const uniqueId = await generateUniqueId(PaymentModel)

    const paymentData = { ...req.body, renterLinkId: uniqueId }
    const payment = new PaymentModel(paymentData)
    const savedInfo = await payment.save()

    return res.json(savedInfo)
  } catch (error) {
    console.error('Error adding payment:', error)
    return res.status(500).json({ error: 'Failed to add payment' })
  }
}

async function fetchPayments(req: Request, res: Response) {
  try {
    const event = req.query.event?.toString() || null
    console.log(event);
    
    const PaymentModel = getPaymentModelByEvent(event)

    const Payments = await PaymentModel.find({})
    res.status(200).json(Payments)
  } catch (error) {
    res.status(401).json(error)
  }
}

export const info = {
  addPayment,
  fetchPayments,
}