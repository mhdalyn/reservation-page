# Periodic Tables Restaurant Reservation Webpage
## Deployed webpage can be viewed here: https://nb-reservation-frontend.herokuapp.com/dashboard
NOTE: Heroku pages shut down when inactive, please allow some time for the application to "start"

## PROJECT SUMMARY
This page was originally submitted as the final capstone project for Thinkful's software engineering program.

This repository is set up as a monorepo, meaning that the front-end and back-end projects are in one repository. This allows you to open both projects in the same editor.



## API

### ERD

### Routes
 Method | Routes | Description                                                                                            |
-|-|-
| GET | `/reservations` | Lists all reservations for current date.   
| POST | `/reservations` | Creates a new reservation.
| GET | `/reservations/?date=YYYY-MM-DD` | Lists reservations for provided date.
| GET | `/reservations/?mobile_number=0000000000` | Lists reservations whose phone number at least includes the searched number. Can be partial, such as an area code.
| GET | `/reservations/:reservation_id` | Returns the reservation data for the given ID
| PUT | `/reservations/:reservation_id` | Updates the reservation data for the given reservation ID

## INSTALLATION INSTRUCTIONS
1. Fork and clone this repository.
2. Run `cp ./back-end/.env.sample ./back-end/.env`.
3. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
4. Run `cp ./front-end/.env.sample ./front-end/.env`.
5. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
6. Run `npm install` to install project dependencies.
7. Run `npm run start:dev` to start your server in development mode.