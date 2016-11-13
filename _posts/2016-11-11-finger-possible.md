---
layout: post
title: Finger Possible
description: A portable, customizable, extremely efficient design proposition for a keyboard-like human-computer interface.
---

# Finger Possible

This post is going to be about a small side project I worked on about a year ago.

As I am going about my day, sometimes I have ideas that I really want to write down, or I need to remember something so I must write it into a to-do list. When I'm on the go, it is difficult to write in anything except my phone because that is usually all I bring with me. I really dislike typing things on my phone when I am moving - it is difficult to watch what is in front of me, and difficult to hit the right keys without looking at the phone.

This, and the burning desire to accomplish my goal of programming while biking, has inspired me to think about different human computer input regimes. The keyboard is a slow and clunky device and is spatially limiting.

In my opinion a better approach would be to put the 'keyboard' on your fingers. This would require an entirely new standard of input interactions. Instead of hitting a key in a specific location of the keyboard to generate a character, that same character could be mapped to a combination of finger presses. For example, the letter 'a' would be mapped from a spatial location (to the left of the 'd' key) to a combination of finger presses (press your left pinky finger). There are many pros to this:
- with two human hands, there are 1024 finger combinations
- with just one hand there are 32 combinations, enough for the alphabet
- you are not bound to the physical location of a keyboard
- using hand taking technologies like leap motion, this is a more effective typing interface than spatial in air typing
- pairing this with a phone means you can safely walk and type without having to look away from the road

Now the concept has been described, what does this all mean I'm terms of an actual device? I have some thoughts and prototypes, but I don't necessarily know the best type of input to use. On that note, I'll enumerate my designs, and please write any comments on improvements or different designs. I built three different designs, but there are probably better solutions than the ones I came up with. Each design is basically built the same, but each differ in the mechanics of the device input (except for one design, which is totally different).

### Button input

Most of my designs involve a gloved keyboard, where the inputs points are on the tips of the fingers. On each finger, there was a single button which was to be pressed during different finger combinations, and each combination makes to a different character (as stated before).

### Capacitive input

This design uses metal strips on the gloved fingertips to detect touch. I can't use the fingertips themselves, because they would always be detected. To get around this problem, one could use a conductive material that is as long as the hand, that touches the palm. Then the use would tap the conductive material to register touches.

### Piezo input

This design takes advantage of the mechanical properties of piezoelectric devices which generate electricity when they vibrate at high frequencies. The user would tap their fingers to register a response.

### Leap Motion input

This system works radically different than the other three. It uses a device called the Leap Motion, which tracks finger and hand movements using an infrared light sensor. So there are no physical objects one would need to wear to use this - just put their hands over the Leap. Or, one could wear the Leap, and type anywhere in front of them.

### Typing mechanics

To reiterate, with this device, one would type letters by tapping combinations of fingers at the same time. With this approach, there are 1023 theoretical finger input combinations.

Due to the overwhelming amount of key combinations possible, there has to be some sensible way to map keys to finger presses. My first thought was to map the most typed keys to easy-to-remember finger combos. The most typed letters would only require a one finger press, and the next most typed letters would require a symmetric two finger press (i.e. Right and left thumb make the letter 'b'). The rest of the keys are relatively haphazardly mapped.

{% include image name='http://i.imgur.com/4l3EU9H.png'  %}
{% include image name='http://i.imgur.com/xEuLPlE.png'  %}
Above: example keyboard mappings for the alphabet and important keys. Finger presses are green circles, and order goes from left pinky to thumb, then right thumb to pinky.

In addition to just mapping characters to different finger combinations, one can imagine mapping 'functions' do different combinations, like 'quit application' or 'focus on chrome window', commonly written phrases like your email signature or 'Hello, It's been awhile, can we schedule a time to catch up', or even usernames and passwords. These could be implemented in a manner similar to [Better Touch Tool](https://www.boastr.net), or as a programming language like how [Hammerspoon](http://www.hammerspoon.org) uses Lua.

### Implementation

How about the build itself? How can this device be implemented? I'm just a novice when it comes to electronics and systems level programming, so I am sure that someone more experienced than I will have a better implementation strategy and will use the right electronic components.

At any rate, I wanted to see if I could build a prototype myself. For the first iteration, I used an [Arduino Leonardo](https://www.arduino.cc/en/Main/ArduinoBoardLeonardo) due to its ability to communicate to the computer as a keyboard peripheral. To implement each key, I connected 10 buttons to 10 of the digital IO ports. Then I collected button press events within a certain time window. This collection window began when the first button press of a combo began.

One aspect I was interested in addressing was the potential to increase typing speed vs a classic keyboard. The average user's typing speed is **replace with actual numbers**. This is pretty fast, and on par with the speed of speech. But it could theoretically be faster, considering typing speeds on the high end are **replace with actual numbers**. Knowing this, I determined that the key detection window needs to be less that **so and so ms**. Another important component is that the collection window has to be sufficiently large enough to be able to register multiple fingers tapping at non-precise moments in time. It is pretty difficult to tap two fingers at exactly the same time. I measured the latencies between tapping a few fingers together, and determined the boundary for this. With a window at **so and so ms** the new theoretical typing speed is now **speed**.

Other options exist for microcontrollers to use as the keyboard. However, it could be difficult to implement using existing keyboard communication protocols. Other options include having a program detect inputs and act like a keyboard, sending keyboard events to the system.

I mentioned leap motion previously - this design exists as a computer program that detects the downward motion of fingers. This program works at a slightly slower speed than the hand keyboard due to its finger tracking. It detects the downward change of a fingertip relative to its palm. Once it reaches a certain threshold, it registers as a finger press.


### Future directions

#### Typing predictions

A unique feature that could be added to this system is something that Android and iOS use as a part of their keyboards - intelligent typing. It could be possible to infer a probability of a certain character based on which characters were already typed and the current typing combination. Then typing error could be automatically corrected.

#### Brain/muscle computer interface

My prototypes for these gloves are pretty invasive to day-to-day activities. One can imagine other prototypes developed utilizing other new technologies. For instance, one company is developing a device that relies on muscular activation to interface with a computer, called [myo](https://www.myo.com). An implementation strategy would be to utilize myo's abilities to detect EMG (electromyogram) signals for each individual finger to determine finger press combinations. Some complications:
- For a full two-hand keyboard, there would have to me a myo on each arm, and they would have to be synchronized. One can get around this by building a simple one-handed keyboard. 2^5 (32) finger combos still gives one the full alphabetical range.
- Myo may require a specific window of time to determine if a muscle is activated, potentially longer that what is needed for a fast keyboard.

My ultimate goal with this project originated from the desire to have a brain machine interface that is able to translate brain activity into legible text. In this spirit, one can imagine that the physical version of this finger keyboard is used to teach the machine the brain's representations for each finger combination. Then to type, the user would just have to think about moving fingers, sort of how our inner voice speaks when we are reading.

#### More sophisticated typing interfaces

Using this keyboard with existing shortcuts is doable, and shortcut sequences could easily programmed into the interface, but we could be limiting the potential to create a very powerful and productive tool. We could build the interface in a context-aware manner, like how Apple builds it's user interfaces for iOS, or as a modal interface like vim's system. One can imagine a finger combination that changes the 'state' of the keyboard from typing mode to sharing mode or application command mode (for things like preferences or quit) that are universal between programs. A simple use case would be to turn on and off the type tracking system with a slightly complex gesture, so it would not be pressed accidentally too often.
