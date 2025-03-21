---
title: Software
---

# Software, firmware, hardware

## Background

Back in 2012, I followed the newly constructed and free [Codecademy](https://www.codecademy.com/) course that taught the fundamentals of programming through javascript.
The lessons were sparse and short, but enough to fuel my excitement to explore the new world of possibilities software development provided.

Over the years, I've developed expertise programming with the following languages, ordered by comfort level: 1) **python**, 2) **javascript**, 3) **julia**, 4) **c**, 5) **matlab**, and gathered experience in other languages such as lua, clojure, groovy, c# and go.
There are similarities many languages share making it easier to take up a new language, but also differences that make some
languages a better choice to solve certain problems. I've had fun thinking about how languages and their accompanying frameworks
are best suited to solve different problems.

I've continued to practice software engineering and other programming-adjacent skills in college and graduate school.

## Graduate school projects

The following software projects showcase some of the software engineering projects I have worked on and managed.
In addition to writing software packages, I have

- built circuits infused with [Arduino](https://store.arduino.cc/products/arduino-uno-rev3) and
[Teensy](https://www.pjrc.com/store/teensy40.html) microcontrollers to talk with experimental equipment
like lasers or to synchronize independent streams of data like neural recordings and videos of mouse behavior.
- developed modeling pipelines to fit deep neural networks from a large pool of training samples.
- produced robust analysis and visualization pipelines to generate the figures in my publications (example
[here](https://github.com/dattalab/dopamine-reinforces-spontaneous-behavior)).

### MoSeq v2

In 2015 the Datta lab [published a paper](https://www.cell.com/neuron/fulltext/S0896-6273(15)01037-5) describing
a probabilistic model that decomposes mouse behavior into stereotyped motifs of action, which the lab calls MoSeq
(short for Motion Sequencing). We wanted to share our model along with the pipeline used to acquire, pre-process,
and model the data. However, as with all research code written to publish a paper, the first version was quite
difficult for other labs to use and install.

{{< image-figure src="images/crowd_movie_example.gif" caption="Example set of stereotyped motifs of action learned using MoSeq." >}}

Building off of [Jeff's](https://bme.gatech.edu/bme/faculty/Jeffrey-Markowitz) work laying out the scaffolding
for an easy-to-use version of the MoSeq pipeline, I lead a team of software engineers to turn the MoSeq pipeline
into a user-friendly ecosystem that includes:

- a suite of python packages to go from video recordings all the way to labeled actions
- expansive documentation (in the form of a wiki) that describes each step of the pipeline, along with formal
documentation for each function defined in the package suite
- example Jupyter notebooks that show how to use the MoSeq pipeline, along with visualizations that show the
consequences of changing parameters
- a [protocol paper](https://arxiv.org/abs/2211.08497) explicitly outlining the steps to run the pipeline
- a [website](https://moseq4all.org) detailing how to get access to the private GitHub repositories that house
the MoSeq codebase and documentation 


{{< image-figure src="images/syllables_small.png" caption="Schematic of syllables. Each unique color is a different syllable MoSeq has identified." imgStyle="background-color:#6f7073;" >}}

### Real-time MoSeq

In 2018-2019, [Jeff Markowitz](https://bme.gatech.edu/bme/faculty/Jeffrey-Markowitz) and I developed a version of
MoSeq that can identify the motifs of action mice produce (the Datta lab calls them "syllables") in near real-time
(within 50ms). We developed this technology in order better understand if the mouse brain contains information about
syllables and if syllable expression can be modified, like reinforcing syllable expression by delivering reward.

In the [companion paper](https://www.nature.com/articles/s41586-022-05611-2), we found many interesting relationships
between spontaneous dopamine (DA) release and behavior, which led us to manipulate DA release in real-time to
understand if it is driving changes to behavior, or just reflecting those changes.

{{< image-figure src="images/closed-loop-rl.svg" imgStyle="background-color:#ffffff; padding:10px; width:96%;" caption="Schematic of the real-time syllable detection system. Depth frames of a mouse exploring an arena are captured, and fed through a size-normalizing and denoising convolutional deep neural netork. After, they are sent to a pre-trained MoSeq model to make predictions about behavior. If we detect the mouse is performing a particular syllable, we can communicate with a laser hooked up to the mouse to optogenetically activate dopamine neurons and release dopamine into the brain.">}}

## Projects before graduate school

### Consulting: wireless control of peripheral nerve stimulation

As a consultant, I co-engineered a front-end user interface to monitor and control wireless peripheral nerve stimulators via bluetooth.
The interface allows a user to select various stimulation patterns and tracks and manages the various stimulator devices connected
to the app.

{{< image-figure src="images/stim.png" caption="An example of the stimulator interface for an early version of the software." >}}

## Hobby projects and other

- I created [this website (plus the styling)](https://github.com/wingillis/wingillis.github.io) using Hugo and github pages.
- I created a system to automatically parse sound files for birdsong as they were generated – it heavily relies on [Jeff Markowitz's scripts](https://github.com/jmarkow/zftftb) which does the sound processing heavy-lifting
- A free Android app called Maybe Later (**NOTE**: it's not available on the Android app store any more)
  - If you ever find yourself wanting to remember small things but don't want to schedule a time to remember it, then this app is for you! It will randomly send your reminder any time within a day, week, or month.

<!-- ## Small, fun, and silly projects -->