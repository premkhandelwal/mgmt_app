import { Request, Response } from 'express'
import { Model } from 'mongoose'

const db = require('../models/index')
const Customer: Model<any> = db.customer

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
  const customerData: Model<any> = await Customer.findOne({
    googleId: getgoogleId,
  }).catch((error) => {
    console.log(error)
    res.status(400).json(error)
  })
  console.log(customerData)
  const data = JSON.parse(JSON.stringify(customerData))
  if(data != null){

    data.id = data._id
  }
  console.log(data)
  return res.status(200).json(data)
}

async function linkRenter(req: Request, res: Response) {}

export const auth = {
  addUser: addCustomer,
  isUserExist: isUserExist,
}
