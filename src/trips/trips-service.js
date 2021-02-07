const TripsService = {
    getAllTrips(knex) {
        return knex.select('*').from('daytripper_trips')
    },
    insertTrip(knex, newTrip) {
        return knex
            .insert(newTrip)
            .into('daytripper_trips')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('daytripper_trips').select('*').where('id', id).first()
    },
    deleteTrip(knex, id) {
        return knex('daytripper_trips')
            .where({ id })
            .delete()
    },
    updateTrip(knex, id, newTripFields) {
           return knex('daytripper_trips')
             .where({ id })
             .update(newTripFields)
         },
}

module.exports = TripsService