# CardNexus Interview Technical Challenge - Submission

## Overview

This repository contains my submission for the CardNexus interview technical challenge. The challenge was to create a simple application that allows users to query card data. The application should be able to store the card data in a database and provide a simple user interface for interacting with the data.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Notes](#notes)
- [What I think I did well](#what-i-think-i-did-well)
- [What I think I could have done better](#what-i-think-i-could-have-done-better)

## Requirements

The application requires the following dependencies:

- Node.js 22.x or higher
- npm 10.x or higher
- pnpm 9.x or higher
- MongoDB installed locally. Version 8.x works for me, but other versions may also be compatible.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/alixsep/cardnexus-challenge.git
   ```
2. Navigate to the project directory:
   ```sh
   cd cardnexus-challenge
   ```
3. Install the required dependencies:
   ```sh
   pnpm i
   ```
4. Start the application:
   ```sh
   pnpm dev
   ```

The backend should now be running on `http://localhost:3000`.
And the frontend on `http://localhost:5173`.

## Notes

- There is a `report.ipynb` file in the root directory that contains my initial thoughts and analysis of the requirements and data available. I wrote this file before starting the project to help me understand the requirements better.
- To ingest the 2 json files just make a get request to `/api/import-json` endpoint.
- Make sure to spend a little time to learn the query builder in the frontend. I think it is the most interesting part of the project.
- Answer to _How you would extend the system if new games or attributes are introduced._:
  - The query generation system is designed to automatically detect the attributes of the cards and generate the query based on the available attributes. If new attributes are introduced, the system will automatically detect them and include them in the query generation process. All that is required is to modify the `Card` schema and the `Card` type to include the new attributes.
  - As for new games, each card has a `game` attribute that specifies the game it belongs to. If new games are introduced, the system will automatically detect them and include them in the query generation process. Modifying the `Games` enum in `libs/types` is enough to include the new games.
- I used the assistance of ChatGPT and Claude to help me with the project. Most of the project is written by me, but I will point out the parts that are not. (some are obvious)

## What I think I did well

- I am very happy with my dynamic metadata service. It is very flexible and can be easily extended to support new games and attributes, and the frontend will automatically adapt to the changes.
- I am very happy with my query builder in the frontend. I think this is the creative part of the project, as I haven't seen anything like this before for advanced searching in a frontend application.
- I am happy with my logger utility that I over-engineered for no reason. It was my guilty pleasure part of this project.
- I am happy with my `report.ipynb` file that I wrote before even starting the project. I usually spend some time to fully understand the requirements and data available before starting a project.

## What I think I could have done better

- This project is NOT the best execution I could do, but I set myself a threshold to not over-engineer it as it has the potential to be a big project. I tried to keep it simple and avoid testing, refactoring, purging, documenting, animating, state-isolating, comprehensive UI design, caching, dockerization, etc. I will be happy to discuss how I would do it if I was given the green light to go further.
- I used a lot of `any` types in the project, which is not a good practice. I thought the time saving was worth it.
- I could have done better in refactoring, but I didn't know if it was required for this project. I read the requirements multiple times and didn't feel there was much interest in refactoring.
