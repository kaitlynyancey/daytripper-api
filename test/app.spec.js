const app = require('../src/app')
const knex = require('knex')
const { expect } = require('chai')
const supertest = require('supertest')
const { makeTripsArray } = require('./trips.fixtures')
const fixtures = require('./trips.fixtures')

describe('App', () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      .expect(200, 'Hello, world!')
  })
})

describe('Trips Endpoints', function() {
  let db

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE daytripper_trips RESTART IDENTITY CASCADE'))

  afterEach('cleanup',() => db.raw('TRUNCATE daytripper_trips RESTART IDENTITY CASCADE'))

  describe(`GET /api/trips`, () => {
    context(`Given no trips`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/trips')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context('Given there are trips in the database', () => {
      const testTrips = fixtures.makeTripsArray()
      beforeEach('insert trips', () => {
        return db
          .into('daytripper_trips')
          .insert(testTrips)
      })

      it('responds with 200 and all of the trips', () => {
        return supertest(app)
          .get('/api/trips')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testTrips)
      })
    })
  })

  describe(`GET /api/trips/:id`, () => {
    context(`Given no trips`, () => {
      it(`responds with 404`, () => {
        const tripId = 123456
        return supertest(app)
          .get(`/api/trips/${tripId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: `Trip doesn't exist` } })
      })
    })

    context('Given there are articles in the database', () => {
      const testTrips = makeTripsArray();

      beforeEach('insert trips', () => {
        return db
          .into('daytripper_trips')
          .insert(testTrips)
      })

      it('responds with 200 and the specified trip', () => {
        const tripId = 2
        const expectedTrip = testTrips[tripId - 1]
        return supertest(app)
          .get(`/api/trips/${tripId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedTrip)
      })
    })

  })

  describe(`POST /api/trips`, () => {
    it(`creates a trip, responding with 201 and the new trip`, () => {
      const newTrip = {
        name: 'New trip',
        location: 'anywhere',
        notes: 'Test new trip content...',
        rating: 3
      }
      return supertest(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .send(newTrip)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newTrip.name)
          expect(res.body.location).to.eql(newTrip.location)
          expect(res.body.notes).to.eql(newTrip.notes)
          expect(res.body.rating).to.eql(newTrip.rating)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/trips/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/trips/${res.body.id}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body)
        )
    })

    const requiredFields = ['name', 'location', 'rating']

    requiredFields.forEach(field => {
      const newTrip = {
        name: 'test name',
        location: 'test location',
        rating: 2
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newTrip[field]

        return supertest(app)
          .post('/api/trips')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(newTrip)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })
  })

  describe(`DELETE /api/trips/:id`, () => {
    context(`Given no trips`, () => {
      it(`responds with 404`, () => {
        const tripId = 123456
        return supertest(app)
          .delete(`/api/trips/${tripId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: `Trip doesn't exist` } })
      })
    })

    context('Given there are trips in the database', () => {
      const testTrips = makeTripsArray()

      beforeEach('insert trips', () => {
        return db
          .into('daytripper_trips')
          .insert(testTrips)
      })

      it('responds with 204 and removes the trip', () => {
        const idToRemove = 2
        const expectedTrips = testTrips.filter(trip => trip.id !== idToRemove)
        return supertest(app)
          .delete(`/api/trips/${idToRemove}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/trips`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedTrips)
          )
      })
    })
   })
})