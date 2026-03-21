# Peer Review - Harsh Raj

- The app works well overall. The watchlist/watched flow makes sense and the filtering + pagination on the All Movies page is a nice touch. Backend is cleanly organized with separate routes, controllers, and services which makes it easy to follow.

- One thing I noticed is that `WatchlistPage.jsx` has a ton of state variables (like 20+), which makes it a bit hard to read. Maybe splitting some of that into smaller components or using useReducer could help. Also the seed data is all just "Synthetic Movie 1", "Synthetic Movie 2" etc. with only 3 descriptions rotating — would look better with more realistic names.

- Auth with Passport is done right, no secrets exposed, no axios/mongoose/cors, PropTypes on every component, CSS files match component names. Everything checks out on the rubric side. Solid project.
