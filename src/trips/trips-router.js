const path = require('path')
const express = require('express')
const xss = require('xss')
const TripsService = require('./trips-service')

const tripsRouter = express.Router()
const jsonParser = express.json()

const serializeTrip = trip => ({
    id: trip.id,
    name: xss(trip.name),
    location: xss(trip.location),
    notes: xss(trip.notes),
    rating: trip.rating
})

tripsRouter
    .route('/')
    .get((req, res, next) => {
        TripsService.getAllTrips(
            req.app.get('db')
        )
            .then(trips => {
                res.json(trips.map(serializeTrip))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, location, notes, rating } = req.body
        const newTrip = { name, location, rating }

        for (const [key, value] of Object.entries(newTrip)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        newTrip.notes = notes

        TripsService.insertTrip(
            req.app.get('db'),
            newTrip
        )
            .then(trip => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${trip.id}`))
                    .json(serializeTrip(trip))
            })
            .catch(next)
    })

tripsRouter
    .route('/:id')
    .all((req, res, next) => {
        TripsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(trip => {
                if (!trip) {
                    return res.status(404).json({
                        error: { message: `Trip doesn't exist` }
                    })
                }
                res.trip = trip 
                next() 
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeTrip(res.trip))
    })
    .delete((req, res, next) => {
        TripsService.deleteTrip(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, location, notes, rating } = req.body
        const tripToUpdate = { name, location, notes, rating }

        const numberOfValues = Object.values(tripToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain at least one updated field`
                }
            })
        }

        TripsService.updateTrip(
            req.app.get('db'),
            req.params.id,
            tripToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = tripsRouter