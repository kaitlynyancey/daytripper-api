CREATE TABLE daytripper_trips (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    notes TEXT,
    rating INTEGER NOT NULL
);