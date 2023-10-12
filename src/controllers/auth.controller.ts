import { Request, Response } from 'express'
import { Model, Mongoose } from 'mongoose'
const mongoose: Mongoose = require('mongoose')

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
  if (data != null) {
    data.id = data._id
  }
  console.log(data)
  return res.status(200).json(data)
}

async function updateNotificationToken(req, res) {
  const collection = mongoose.connection.collection('secret')

  // Define the query to find the document
  const query = {
    /* Define your query criteria here */
  }

  // Define the update operation
  const update = {
    $set: {
      adminNotificationToken: req.body.token,
    },
  }

  // Options for the update
  const options = { upsert: true }

  try {
    const result = await collection.updateOne(query, update, options)

    if (result.upsertedCount === 1) {
      // The document was inserted
      return res.status(201).json('Token created successfully')
    } else {
      // The document was updated
      return res.status(200).json('Token updated successfully')
    }
  } catch (error) {
    console.error(error)
    return res.status(400).json(error)
  }
}

async function getNotificationToken(req: Request, res: Response) {
  const collection = mongoose.connection.collection('secret')

  try {
    const document = await collection.findOne(
      {},
      { projection: { adminNotificationToken: 1 } },
    )

    if (document) {
      const adminNotificationToken = document.adminNotificationToken
      return res.status(200).json({ adminNotificationToken })
    } else {
      return res.status(404).json('Token not found')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export const auth = {
  addUser: addCustomer,
  isUserExist: isUserExist,
  updateNotificationToken: updateNotificationToken,
  getNotificationToken: getNotificationToken,
}
