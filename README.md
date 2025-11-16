# Zero-Config MERN Starter Generator

Instantly generate a ready-to-use MERN project without manual setup

## What is this repo?

This repository provides a **backend generator** that creates a fully functional MERN stack project (MongoDB, Express, React, Node.js) in one click. It outputs a downloadable ZIP containing a ready-to-run frontend and backend structure.

## What problem does it solve?

Setting up a MERN project from scratch can be time-consuming: installing dependencies, configuring TypeScript, setting up Vite, wiring the backend with MongoDB, and adding sample CRUD routes. This generator removes all that friction:

*   No manual boilerplate setup
*   Pre-configured backend with in-memory MongoDB for prototyping
*   Pre-configured frontend using Vite + React + TypeScript
*   Ready-to-run project structure you can start coding immediately

## How to replicate this locally

Follow these steps to run the generator on your machine:

# Clone the repo
git clone https://github.com/dhuruvandb/zero-config-mern-starter-generator.git
cd zero-config-mern-starter-generator

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start the backend generator
npm start

# The backend is live at:
http://localhost:8000
  

## How to use the generator

Once your backend is running:

*   Send a GET request to `/api/generate-mern-starter`
*   The response will be a **ZIP file** containing your MERN project
*   Extract the ZIP to your workspace
*   Run the frontend and backend separately:

# Backend
cd server\
npm install\
npm run dev

# Frontend
cd client\
npm install\
npm run dev
  

You now have a full MERN project ready for development!

## Why use this generator?

*   Skip tedious boilerplate setup
*   Rapid prototyping with in-memory MongoDB
*   Learn and experiment with MERN stack quickly
*   Perfect for bootstrapping projects, hackathons, or teaching purposes

Made with ❤️ by **dhuruvandb**

[View on GitHub](https://github.com/dhuruvandb/zero-config-mern-starter-generator)
