# Week Planner

This repository hosts a simple web application for graphical week planning.
The application runs directly off an HTML file and has no backend.
Persistence is taken care of using the local storage API.

![](screenshot.png)

## Warning

There is no local or cloud backup.
The application is rudimentary, for personal use and non-serious at that.

## Running

To run the application, open the path of the `index.html` file in your browser.
You might need to configure your browser to allow CORS on the `file:` protocol.

You can also use the online version at:
https://tomashubelbauer.github.io/week-planner

## Features

Shows single week of 10-minute slots which can be annotated with activity types.

Allows for single and multiple slot selection (via clicking or dragging).

## Roadmap

There are no updates planned.
I made it because I wanted to visualize a particular week as a one-off.
I might improve it if I need to use it again.
The improvements I have in mind are kept in this readme.

## To-Do

- [ ] Implement import and export functionality

  Collect the local storage into a JSON file and download it to backup.

- [ ] Host on Deno Deploy as a fully- or semi-static website

  To make available online, host on Deno Deploy.
  Perhaps add a HTTP Basic auth and come up with a little backend, too.
  Use Supabase for persistence of data.

- [ ] Consider merging with https://github.com/TomasHubelbauer/week-planner

  I am prototyping that as its own thing but there is an opportunity for reuse
  and rather than pulling out the commons into a shared ESM package set, I think
  it might make sense to make this a single Planner application with two weeks
  into the same data.

- [ ] Use the ESM import maps to abstract away DOM access and introduce tests

  The tests will make it possible to mock the DOM elements and ensure the right
  DOM operations are called on them by the individual flows.

- [ ] Implement a single step undo

  I don't think an undo stack is necessary, but it would be nice to be able to
  fix mistakes spotted right away.
  Undo multiple slots if the last action was to paint all of them in one stroke.

- [ ] Use https://github.com/TomasHubelbauer/github-pages-local-storage

  This will ensure that the local storage as used by this app remains isolated
  from local storage as seen by other apps on the same origin, i.e. my other
  apps running on GitHub Pages.

- [ ] Associate event listeners weakly to avoid memory leaks

  Right now I am leaking data all over the place.

- [ ] Generate the screenshot in a GitHub Actions workflow and push it to readme

  I added the screenshot manually but it is already out of date, so let's make
  that automatic.

- [ ] Select the current slot when the browser tab gains focus

  This will make it easy to spot and annotate fast.

- [ ] Use a `dialog` with an `input` with a pre-filled `datalist` of types

  The `prompt` is a good and easy free form input solution, but it doesn't allow
  one to pick something already used before quickly.
  By using a `datalist`, I will get the freedom of free-form but also the speed
  of pre-filled.

- [ ] Make statistics span clicks present a menu of their options

  Right now, clicking a statistics span focuses the table and makes it readonly.
  But there are a couple more options to present and behaviors to execute:
  - List out the selected slot ranges under the table
  
    Combine neighboring slots into one range in order to not list all slots.

  - Display an option / a modal for setting the desired minimum/maximum time

    This will help track good neglected habits and bad indulged habits.
    Store the minimum/maximum object under the verb name in the local storage.
    
  - Display an option / a toggle for showing or hiding the verb in statistics

    Alternatively, use the presence of minimum/maximum to indicate visibility.
