---
title: Finger Possible
description: A portable, customizable, extremely efficient design proposition for a keyboard-like human-computer interface.
date: 2016-11-11
---
# Finger Possible

This post is on a project that I worked on in 2015-2016.

## Problem

Throughout the day I have ideas or to-dos I want to remember. However, I usually only carry my phone around with me. If I'm on the move, it's very difficult to write down my ideas on my phone and watch what's in front of me. This (and the desire to program while biking) has inspired me to think about different ways humans can interact with computers. One such interaction that could use updating is the keyboard. The keyboard is a slow, limiting device. One has to sit in front of it and place their fingers on precise points (the keys) to produce coherent output. In my experience, this is especially inefficient with touch screen keyboards. There is no tactile feedback - only visual feedback, meaning you have to look down while writing.

## Idea

Many frustrations, including typing with a touch screen keyboard, led me to think of alternative input methods. One approach I thought of was to put the 'keyboard' onto the fingers. Combinations of tapped fingers would produce coherent output. This immediately removes the spatial limitations of a keyboard. Instead of hitting a key in a specific location of the keyboard to generate a character, that same character can be mapped to a combination of finger presses (which can tap anywhere, even on someone's body). For example, the letter 'a' can be mapped from its spatial location on the keyboard to a combination of finger presses (press your left middle finger).
Here are some pros:
- with two 10-finger hands, there are 1023 finger combinations
- with just one hand there are 31 combinations, enough to type all the letters, plus some
- there are no spatial limitations
- phone typing can potentially be a lot less distracting
- there are more opportunities to interact with a computer without spatial limitations

Can an actual device like this be built? Is this device practical or feasible? I have some thoughts and prototypes, but I don't necessarily know the best type of input (mechanism) to use. On that note, I'll enumerate my designs, and please write any comments/criticisms for improvements or different designs. I will present four designs, each fairly similar, and there could be better solutions than the ones I came up with.

### Button input

Most of my designs involve a gloved keyboard, where the inputs points are on the tips of the fingers. On each finger, there was a single button which was to be pressed during different finger combinations, and each combination makes to a different character (as stated before).

<figure>
<img src="https://i.imgur.com/8IMTo1q.png">
<figcaption>
The button 'keyboard'. The black loops slip onto the tip of each finger. there are buttons on one side of the black loops, located on the finger tips.
</figcaption>
</figure>


### Capacitive input

This design uses metal strips on the gloved fingertips to detect touch. The metal senses a characteristic change in capacitance when it touches a hand or other similar object. The metal strips on each finger are isolated from the finger itself so it doesn't detect touch inputs all the time. To get around this problem, a conductive material that touches the palm and extends to the fingers can be tapped to register touches.

<figure>
<img src="https://i.imgur.com/2OzYh0F.png">
<figcaption>
The capacitive touch keyboard. Metal strips are located on the fingertips for detecting touches to skin or metal.
</figcaption>
</figure>

### Piezo input

This design takes advantage of the mechanical properties of piezoelectric devices; they generate electricity when they vibrate. Tapping fingers induces a detectable current for measuring a response.

<figure>
<img src="https://i.imgur.com/vT41I0x.png">
<figcaption>
Example of what the piezo keyboard prototype looks like on my hand.
</figcaption>
</figure>

<figure>
<img src="https://i.imgur.com/p2ctbK4.png">
<figcaption>
Circuitry of the keyboard and both gloves. The board is an Arduino Leonardo.
</figcaption>
</figure>

<figure>
<img src="https://i.imgur.com/qQjvg7Z.png" alt="bluetooth keyboard">
<figcaption>
An example of what a fixed piezo keyboard could look like. This was mainly a prototype to see if I could get it working in a more 'portable' form. It's portability comes from the fact that it is powered by a battery and connects to a device as a bluetooth keyboard, sending commands wirelessly. However, it is quite large and is spatially limited which I previously ragged on.
</figcaption>
</figure>

### Leap Motion input

This system works radically different than the other three. It uses a device called the [Leap Motion](https://www.leapmotion.com/), which tracks finger and hand movements using an infrared (IR) light sensor. So there are no physical objects one would need to wear to use this - just put their hands over the Leap. Or, one could wear the Leap, and type anywhere in front of them. This version has an advantage over other keyboard implementations used in the leap motion software - the other versions use spatial mapping, which can take away from productivity and user experience.

<figure>
<img src="https://i.imgur.com/pnaYwd7.png">

<figcaption>
An example of leap motion keyboard. A hovered hand can press down finger combinations anywhere, and the leap will register a keypress. The purple LEDs in the device are actually the IR sensors.
</figcaption>
</figure>

### Typing mechanics

To reiterate, with this device, one would type letters by tapping combinations of fingers at the same time. With this approach, there are 1023 theoretical finger input combinations.

Due to the overwhelming amount of key combinations possible, there has to be some sensible way to map keys to finger presses. My first thought was to map the most typed keys to easy-to-remember finger combos. The most typed letters would only require a one finger press, and the next most typed letters would require a symmetric two finger press (i.e. Right and left thumb make the letter 'd'). The rest of the keys are relatively haphazardly mapped.

<figure>
<div class="pure-u-1 pure-u-md-1-2">
<img class="pure-img" src="https://i.imgur.com/4l3EU9H.png">
</div>
<div class="pure-u-1 pure-u-md-1-2">
<img class="pure-img" src="https://i.imgur.com/xEuLPlE.png">
</div>
<figcaption>
Example keyboard mappings for the alphabet and important keys. Finger presses are green circles, and order goes from left pinky to thumb, then right thumb to pinky.
</figcaption>
</figure>

In addition to just mapping characters to different finger combinations, one can imagine mapping 'functions' do different combinations, like 'quit application' or 'focus on chrome window', commonly written phrases like your email signature or 'Hello, It's been awhile, can we schedule a time to catch up', or even usernames and passwords. These could be implemented in a manner similar to [Better Touch Tool](https://www.boastr.net), or as a programming language like how [Hammerspoon](http://www.hammerspoon.org) uses Lua.

### Implementation

How about the build itself? How can this device be implemented? I'm just a novice when it comes to electronics and systems level programming, so I am sure that someone more experienced than I will have a better implementation strategy and will use the right electronic components.

At any rate, I wanted to see if I could build a prototype myself. For the first iteration, I used an [Arduino Leonardo](https://www.arduino.cc/en/Main/ArduinoBoardLeonardo) due to its ability to communicate to the computer as a keyboard peripheral. To implement each key, I connected 10 buttons to 10 of the digital IO ports. Then I collected button press events within a certain time window. This collection window began when the first button press of a combo began.

One aspect I was interested in addressing was the potential to increase typing speed vs a classic keyboard. The average user's typing speed is 44 wpm. This is slower that the average adult's reading speed (270 wpm). Considering typing speeds on the high end are 212 wpm, typing can improve. Knowing this, I determined that the key detection window needs to be around 50-75 ms to start with. Another important component is that the collection window has to be sufficiently large enough to be able to register multiple fingers tapping at non-precise moments in time. It is pretty difficult to tap two fingers at exactly the same time so in the software I accumulate taps until the window has been reached. With a window at 65 ms, the new theoretical typing speed is close to the fastest typing limit. With practice this limit can increase and the tap detection window can decrease as well.

Other options exist for microcontrollers to use as the keyboard, like having a program detect inputs and acts like a keyboard, sending keyboard events to the operating system.

I mentioned leap motion previously - this design exists as a computer program that detects the downward motion of fingers. This program works at a slightly slower speed than the hand keyboard due to its finger tracking. It detects the downward change of a fingertip relative to its palm. Once it reaches a certain threshold, it registers as a finger press.

### Mouse input

One might ask, 'where is the mouse'? This need not be abandoned. It can also undergo some fundamental changes in how it works - instead of moving your hand positionally around a table, you can rotate it. Tapping fingers together can be used to click the mouse. It is entirely possible that a mouse can be more or less neglected. If the interface and navigation are optimized, a mouse would not be needed to move from application to application. If one were thinking about interfacing this device to something like the Magic Leap, a traditional mouse and keyboard would be severely limiting in the ways and richness for interacting with the augmented reality system, where hand gestures and contextual manipulation seem more natural.

## Future directions

### Typing predictions

A unique feature that could be added to this system is something that Android and iOS use as a part of their keyboards - intelligent typing. It could be possible to infer a probability of a certain character based on which characters were already typed and the current typing combination. Then typing error could be automatically corrected.

### Brain/muscle computer interface

My prototypes for these gloves are pretty invasive to day-to-day activities. One can imagine other prototypes developed utilizing other new technologies. For instance, one company is developing a device that relies on muscular activation to interface with a computer, called [myo](https://www.myo.com). An implementation strategy would be to utilize myo's abilities to detect EMG (electromyogram) signals for each individual finger to determine finger press combinations. Some complications:
- For a full two-hand keyboard, there would have to me a myo on each arm, and they would have to be synchronized. One can get around this by building a simple one-handed keyboard. 2^5 (32) finger combos still gives one the full alphabetical range.
- Myo may require a specific window of time to determine if a muscle is activated, potentially longer that what is needed for a fast keyboard.

My ultimate goal with this project originated from the desire to have a brain machine interface that is able to translate brain activity into legible text. In this spirit, one can imagine that the physical version of this finger keyboard is used to teach the machine the brain's representations for each finger combination. Then to type, the user would just have to think about moving fingers, sort of how our inner voice speaks when we are reading.

### More sophisticated typing interfaces

Using this keyboard with existing shortcuts is doable, and shortcut sequences could easily programmed into the interface, but we could be limiting the potential to create a very powerful and productive tool. We could build the interface in a context-aware manner, like how Apple builds it's user interfaces for iOS, or as a modal interface like vim's system. One can imagine a finger combination that changes the 'state' of the keyboard from typing mode to sharing mode or application command mode (for things like preferences or quit) that are universal between programs. A simple use case would be to turn on and off the type tracking system with a slightly complex gesture, so it would not be pressed accidentally too often.

### Integration with Magic Leap

In my opinion, one of the most promising computing paradigms is augmented reailty.
It will probably revolutionize they way we interact with computers.
Briefly, it creates an augmented reality experience by superimposing computer-generated images in visual space, without seriously obstructing field of view.
One very useful application of my hand keyboard would be one mechanism of interfacing with devices built for augmented reality, most importantly for textual or procedural input.
