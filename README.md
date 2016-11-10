# Stock Chart multi-platform app

Live web demo (fully responsive, try resizing / changing orientation):

http://sergeylukin.com/stock-chart/ (170Kb all together)

This project was built for one of my interviews.

The task was to build an area chart that streams some random points
starting from the left bottom corner expanding as more points are
rendered and stops expanding at, say, the middle of the plot,
pushing first points off the screen as new points are added, i.e.
performing Queue shift / unshift.

The biggest challenge was not the visual result but rather the
decision making while I was choosing the tech stack that would power it all.

I had at least following options:

- dig into WebGL and just brainstorm the whole thing hoping that it really
  provides me with the fastest solution possible

- use Canvas 2d instead as it's easier and also performant enough for something
  like chart that displays limited amount of data

- use svg as it is even more human-friendly and more semantic and has native
  interaction events support (what if this will be required in the future?)
  as it's part of DOM...

All these options have various frameworks assigned with them: Three.JS /
Babylon.js for WebGL, PixiJS / Two.js / what's not for canvas, snap.svg and
plain SVG for SVG, etc.

However I had a bad feeling about all these, here is why:

- Once one option is used, it's nearly impossible to switch to another one

- WebGL, while being the most performant probably, is hard to work with for me:
  Three.JS is just overcomplicated for something like 2d basic area chart
  and unreasonably leads to ugly codebase which makes it hard to maintain
  in the future. I have little to no experience with WebGL and libraries
  around it so it may be just me struggling, but then again, once WebGL
  is used, you can't switch, at least I'm not aware of any solutions atm.

- I want to have an option to use the code on native mobile platforms
  at any moment in the future (or even right now, why not?), none
  of these solutions provide that out-of-the-box.

So I continued researching. I wanted to build the whole thing using
ReactJS / React Native and reuse as much code as possible.
But how do you share rendering code betwen different platforms?
Turns out it's possible, and here is how I did it.

First, I found out that [D3.js](https://d3js.org/) can operate
headlessly on data and plotting, meaning you can feed it with data
and be able to get/set/manipulate coordinates and vector paths
in many many ways.
Wow, what a separation of concerns, isn't it?
Great, so say I have my data covered, vector paths covered, now
how do I render the paths on both web browser and mobile so that
browser would use WebGL technology or Canvas at worst with
fallbacks to SVG and VML in case browser doesn't support the
formers and mobile platforms use their native SVG implementations?

Whoa, turns out there is a solution for that too, it's called
[ART](https://github.com/sebmarkbage/art/). What it does is it
provides an abstraction above all the graphic rendering
web technologies (SVG, Canvas, etc.) and provides a very
easy to understand and manipulate syntax similar to SVG
but even nicer one and performs transformation to
any of the supported formats.
Even better there is
[ReactJS ART binding](https://github.com/reactjs/react-art)
and also a [React Native
binding](https://github.com/facebook/react-native/tree/master/Libraries/ART).

Oh, boy, what a paradise, so we can feed D3.js with data and
pass it to ART to render on all platforms? Crazy, but it's true,
it really works and works great.

Here is a snapshop showing me running this project on both
web and iOS from same code (well, something I didn't move to
shared folder yet, for example data generation logic is duplicated
for now but it's not hard to solve by moving it to a Redux store
  and sharind Reducers / Actions instead, anyways the most
  important part for me was to share the core chart-related
  logic):

![Shared code]
(https://raw.githubusercontent.com/sergeylukin/stock-chart/master/assets/intro.jpg)


## How to run

Run web dev version locally:

```
npm install && npm start
```

Build minified production ready version:

```
npm run build
```

Run ios / android locally:

```
cd native
npm install
npm install -g react-native
react-native run-ios
# OR
react-native run-android
```
