---
layout: post
title: Software
permalink: /software/
---

<!-- REWRITE!!! make a bit more professional -->
<!-- # Outline
- [x] background about my programming abilities
- Describe the main highlights I've used my programming for
  1. Building and managing MoSeq, building real-time MoSeq
  2. Data analysis, pipelining, and figure generation
  3. Building hardware and experiments -->

# Software, firmware, hardware

## Background

Back in 2012, I followed the newly constructed and free [Codecademy](https://www.codecademy.com/) course that taught the fundamentals of programming through javascript.
The lessons were sparse and short, but enough to fuel my excitement to explore the new world of possibilities software development provided.

<!-- Describe general experience with different programming languages, paradigms, and platforms -->
Over the years, I've developed expertise programming with the following languages, listed in order of comfort level:
1) **python**, 2) **javascript**, 3) **julia**, 4) **c**, 5) **matlab**, and gathered experience in other languages such as lua, clojure, groovy, c# and go.
There are similarities many languages share making it easier to take up a new language, but also differences that make some
languages a better choice to solve certain problems. I've had fun thinking about how languages and their accompanying frameworks
are best suited to solve different problems.

I've continued to practice software engineering and other programming-adjacent skills in college and graduate school.

## Graduate school projects

The projects I've worked on in graduate school are usually built to conduct customized experiments,
always with the goal of making it easier to answer questions about biology.

### Real-time MoSeq

<!-- I think I want to talk about the first version I built with Jeff first, and maybe later include the new version -->

I built the first version (v1) with [Jeff Markowitz](https://bme.gatech.edu/bme/faculty/Jeffrey-Markowitz) in 2018-2019
so that we could classify stereotyped modules of mouse behavior (our lab calls them "syllables") in real-time and
reinforce their expression by optogenetically evoking dopamine release into the dorsolateral striatum (a sub-cortical
brain structure involved in action selection).

### MoSeq v2

In 2015 the Datta lab [published a paper](https://www.cell.com/neuron/fulltext/S0896-6273(15)01037-5) describing a probabilistic model
that decomposes mouse behavior into stereotyped motifs of action, which the lab calls MoSeq (short for Motion Sequencing). We wanted to 
share our model along with the pipeline used to acquire, pre-process, and model the data. However, as with all research code written
to publish a paper, the first version was quite difficult for other labs to use and install.

Building off of [Jeff Markowitz's](https://bme.gatech.edu/bme/faculty/Jeffrey-Markowitz) work laying out the scaffolding for an easy-to-use
version of the MoSeq pipeline, I lead a team of software engineers to turn the MoSeq pipeline into a user-friendly ecosystem that includes:
- a suite of python packages to go from video recordings all the way to labeled actions
- expansive documentation (in the form of a wiki) that describes each step of the pipeline, along with formal documentation for each
  function defined in the package suite
- example Jupyter notebooks that show how to use the MoSeq pipeline, along with visualizations that show the consequences of changing parameters
- a [protocol paper](https://arxiv.org/abs/2211.08497) explicitly outlining the steps to run the pipeline
- a [website](https://moseq4all.org) detailing how to get access to the private GitHub repositories that house the MoSeq codebase and documentation 

## Pre-graduate school projects

### Consulting: wireless control of peripheral nerve stimulation

As a consultant, I co-engineered a front-end user interface to monitor and control wireless peripheral nerve stimulators via bluetooth.
The interface allows a user to select various stimulation patterns and tracks and manages the various stimulator devices connected
to the app.

<figure>
  {% asset stim.png %}
  <figcaption>An example of the stimulator interface for an early version of the software.</figcaption>
</figure>

## Hobby projects and other

- I created [this website](https://github.com/wingillis/wingillis.github.io) using jekyll and github pages. I also designed the theming (check out the cool skulls in the background)!
- [Tic-Toc](/tic-toc/) (made **BEFORE** TikTok was big) is a web app for making serial timers (user guide [here](https://wingillis.github.io/blog/tic-toc/)).
- I created a system to automatically parse sound files for birdsong as they were generated – it heavily relies on [Jeff Markowitz's scripts](https://github.com/jmarkow/zftftb) which does the sound processing heavy-lifting
- A web-based timer utilizing [Trello](https://trello.com) for task management [source](https://github.com/wingillis/trelloAlarm)

<figure>
  {% asset trello.png %}
  <figcaption>How the timer looks when inactive</figcaption>
</figure>

- A [fun little art project](/software/fireworks/) that shoots small circles around the webpage

<figure>
  <a href="/software/fireworks">
    {% asset fireworks.png %}
    <figcaption>Screenshot of the art project</figcaption>
  </a>
</figure>

- A free Android app called Maybe Later (**NOTE**: I haven't updated the app in years - thus, it's not available on the Android app store any more)
  - If you ever find yourself wanting to remember small things here-and-there, but you don't want to schedule a time to remember it, this app is for you! It will randomly remind you what you want in around a day, week, or month.

<!-- ## Small, fun, and silly projects -->