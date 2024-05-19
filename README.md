# Matching Madness Inspired Game

Matching Madness is a vocabulary learning game powered by Remix.js. Users can create word sets, manage their vocabulary, and play a matching game to practice their words and translations.
The main goal of this project for me was to try remix, to try tailwind and to try to make rough MVP in the shortest time.

## Check LIVE 

[Live Version](https://match-madness-inspired-game-4f96.vercel.app)

## Features

- Create and manage word sets
- Add, update, and delete words and translations
- Play a matching game with a timer
- Responsive and visually appealing UI
- Built with Remix.js, Tailwind CSS, IndexedDb

## Project Structure

- `app/`: Contains the main application components and routes
    - `components/`: Reusable React components
    - `routes/`: Remix.js routes for different pages
    - `db/`: Database utility functions
- `public/`: Static assets (e.g., images, fonts)
- `README.md`: Project documentation

## To-Do List

- [x] Implement basic word set management (CRUD operations) with IndexedDB
- [x] Create the matching game interface
- [x] Add timer functionality to the game
- [x] Implement game over and win conditions
- [x] Style the application with Tailwind CSS (and not happy with that)
- [ ] integrate some proper state management system, get rid of many setStates
- [ ] Rewrite from Tailwind CSS
- [ ] Migrate from indexeddb to some real database
- [ ] Add user authentication
- [ ] Save game progress and user statistics
- [ ] Add more customization options for the game
- [ ] Write tests

