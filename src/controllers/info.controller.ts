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

    const paymentData = {
      ...req.body,
      renterLinkId: uniqueId,
      isDeleted: false,
      updatedOn: new Date(),
      updatedBy: req.body.updatedBy || 'system',
    }

    const payment = new PaymentModel(paymentData)
    const savedInfo = await payment.save()

    return res.json(savedInfo)
  } catch (error) {
    console.error('Error adding payment:', error)
    return res.status(500).json({ error: 'Failed to add payment' })
  }
}

async function deletePayment(req: Request, res: Response) {
  try {
    const { id } = req.params
    const event = req.body.event || null
    const updatedBy = req.body.updatedBy || 'system'
    const PaymentModel = getPaymentModelByEvent(event)

    const updated = await PaymentModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        updatedOn: new Date(),
        updatedBy: updatedBy,
      },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    res.json({ message: 'Payment soft deleted', data: updated })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: 'Failed to delete payment' })
  }
}

async function fetchPayments(req: Request, res: Response) {
  try {
    const event = req.query.event?.toString() || null
    const PaymentModel = getPaymentModelByEvent(event)
    const Payments = await PaymentModel.find({ isDeleted: false })
    res.status(200).json(Payments)
  } catch (error) {
    res.status(401).json(error)
  }
}

export const info = {
  addPayment,
  fetchPayments,
  deletePayment,
}