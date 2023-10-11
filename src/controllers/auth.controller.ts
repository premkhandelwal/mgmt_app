import { Request, Response } from 'express'

const db = require('../models/index')
const Customer = db.customer

async function addCustomer(req: Request, res: Response) {
  if (!req.body.googleId) {
    res.json({ error: 'Invalid request data' })
  }
  const customerData = {
    googleId: req.body.googleId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobileNo: req.body.mobileNo,
    emailId: req.body.emailId,
    type: req.body.type,
    photoUrl: req.body.photoUrl,
    renterLinkId: req.body.renterLinkId, //Will be passed only if type is renter
  }
  const customer = new Customer(customerData)
  const savedCustomer = await customer.save()
  return res.json(savedCustomer.id)
}

async function isUserExist(req: Request, res: Response) {
  const getgoogleId = req.body.googleId
  console.log(getgoogleId)
  const customerData = await Customer.findOne({ googleId: getgoogleId }).catch(
    (error) => {
      console.log(error)
      res.status(400).json(error)
    },
  )
  let resData = req.body.googleId['payload']
  console.log(resData)

  return res.status(200).json(resData)
}

async function linkRenter(req: Request, res: Response) {}

export const auth = {
  addUser: addCustomer,
  isUserExist: isUserExist,
}
