import { Request, Response } from 'express'
import { Mongoose } from 'mongoose'
import { GoogleAuth } from 'google-auth-library'
import path from 'path'
const mongoose: Mongoose = require('mongoose')

const db = require('../models/index')
const { getCustomerModelByEvent } = db.customer

async function addCustomer(req: Request, res: Response) {
  if (!req.body.googleId) {
    return res.status(400).json({ error: 'Invalid request data' })
  }

  const event = req.body.event || null
  const Customer = getCustomerModelByEvent(event)

  const customerData = {
    googleId: req.body.googleId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobileNo: req.body.mobileNo,
    emailId: req.body.emailId,
    type: req.body.type,
    photoUrl: req.body.photoUrl,
    renterLinkId: req.body.renterLinkId, // Will be passed only if type is renter
    event,
  }

  const customer = new Customer(customerData)
  const savedCustomer = await customer.save()
  return res.json(savedCustomer.id)
}

async function isUserExist(req: Request, res: Response) {
  const googleId = req.body.googleId
  const event = req.body.event || null
  const Customer = getCustomerModelByEvent(event)

  try {
    const customerData = await Customer.findOne({ googleId })

    if (!customerData) {
      return res.status(404).json(null)
    }

    const data = JSON.parse(JSON.stringify(customerData))
    data.id = data._id
    return res.status(200).json(data)
  } catch (error) {
    console.error(error)
    return res.status(400).json(error)
  }
}

async function updateNotificationToken(req: Request, res: Response) {
  const collection = mongoose.connection.collection('secret')

  const query = {}
  const update = {
    $set: {
      adminNotificationToken: req.body.token,
    },
  }
  const options = { upsert: true }

  try {
    const result = await collection.updateOne(query, update, options)
    const message =
      result.upsertedCount === 1
        ? 'Token created successfully'
        : 'Token updated successfully'
    return res.status(result.upsertedCount === 1 ? 201 : 200).json(message)
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
      return res
        .status(200)
        .json({ adminNotificationToken: document.adminNotificationToken })
    } else {
      return res.status(404).json('Token not found')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

async function getAllUsers(req: Request, res: Response) {
  const event = req.query.event?.toString() || null
  const Customer = getCustomerModelByEvent(event)

  try {
    const customerData = await Customer.find()

    const customerListJson = JSON.parse(JSON.stringify(customerData))
    customerListJson.forEach((customer) => {
      customer.id = customer._id
    })

    res.status(200).json(customerListJson)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

async function sendAdminNotification(req: Request, res: Response) {
  const { title, body, data } = req.body

  const projectId = 'mgmt-400909' // update this
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // handle newline chars
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || 'googleapis.com',
};
  try {
    
    const collection = mongoose.connection.collection('secret')
    const document = await collection.findOne(
      {},
      { projection: { adminNotificationToken: 1 } },
    )
    console.log(document)

    if (!document || !document.adminNotificationToken) {
      return res.status(404).json({ message: 'Notification token not found' })
    }

    // Get access token using Google Auth
    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    })
    const client = await auth.getClient()
    const accessToken = await client.getAccessToken()

    const messagePayload = {
      message: {
        token: document.adminNotificationToken,
        notification: {
          title,
          body,
        },
        data: data || {},
      },
    }

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      },
    )

    const responseBody = await response.json()

    if (!response.ok) {
      return res
        .status(500)
        .json({ message: 'Failed to send notification', error: responseBody })
    }

    return res
      .status(200)
      .json({ message: 'Notification sent', response: responseBody })
  } catch (error) {
    console.error('Error sending notification:', error)
    return res.status(500).json({ message: 'Internal server error', error })
  }
}

export const auth = {
  addUser: addCustomer,
  isUserExist: isUserExist,
  updateNotificationToken: updateNotificationToken,
  getNotificationToken: getNotificationToken,
  getAllUsers: getAllUsers,
  sendAdminNotification: sendAdminNotification,
}
