import { Request, Response } from 'express'
import { Model } from 'mongoose'

const db = require('../models/index')
const Payment: Model<any> = db.payment
const Customer: Model<any> = db.customer

async function generateUniqueId() {
  const count = await Payment.countDocuments()
  const sixDigitId = (count + 1).toString().padStart(6, '0')
  return sixDigitId
}

async function addPayment(req: Request, res: Response) {
  try {
    const uniqueId = await generateUniqueId()
    const paymentData = { ...req.body, renterLinkId: uniqueId }
    const payment = new Payment(paymentData)
    const savedInfo = await payment.save()
    return res.json(savedInfo)
  } catch (error) {
    console.error('Error adding payment:', error)
    return res.status(500).json({ error: 'Failed to add payment' })
  }
}

async function fetchPayments(req: Request, res: Response) {
  
  try {
    const Payments = await Payment.find({})
    res.status(200).json(Payments)
  } catch (error) {
    res.status(401).json(error)
  }
}



export const info = {
  addPayment: addPayment,
  fetchPayments: fetchPayments,
  // addNotificationToken: addNotificationToken,
}
