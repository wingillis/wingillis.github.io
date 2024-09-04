---
title: Hammerspoon Vim Bindings
description: Tutorial on how to give all applications vim-like capabilities
date: 2017-08-08
---

If you're like me, you program a lot. And if you're like me, you program with
vim a lot. I've grown so accustomed to the vim commands for navigating and
saving files that I'm frequently hitting these keys while using, Microsoft Word,
Evernote, or other text-based apps. [Hammerspoon] provides the framework to
implement a vim-like keymapping for other applications.

**Note:** this software only works for macOS.

### How about a brief overview

Hammerspoon is an application that combines the lua language with
the macOS operating system so that you can interact with the GUI in
powerful programmatic ways. One of these ways is by added hotkeys to start
user-defined events, like detecting keystrokes. I used this to implement
vim bindings activated by the activating a shortcut. 

These vim-like key bindings allow the user to use the same keys they would
use in normal mode to navigate in other mac applications, like Word, Evernote,
Google Docs, like I described above. You can also delete text in vim style
as well! If you need to select text, a terse visual-mode has been
implemented to support this. Much has been implemented, but it is still
lacking, which is discussed briefly below.

## How to install

1. Install [hammerspoon].
2. Download my [vim-bindings repository][vim].
3. Follow the brief installation instructions in the repository's README.
4. Test it out.

## How to use

The most important command to know is `option + escape` which is the entry into
vim mode from any application. Once in vim mode, a notification will display
in the center of the screen. Basic navigation commands work, like: `j`, `k`,
`l`, and `h` which code for: :arrow_down:, :arrow_up:, :arrow_right:, :arrow_left:, respectively.
Below are a list of commands that you should know for application control:
- `i`: exit 'normal' mode into regular computer mode
- `a`: exit 'normal' mode into regular computer mode, and move cursor to right
- `o`: exit 'normal' mode into regular computer mode, and press enter
- `O`: exit 'normal' mode into regular computer mode, move up, and press enter
- `I`: exit 'normal' mode into regular computer mode, and go to line beginning
- `A`: exit 'normal' mode into regular computer mode, and go to line end
- `w`: go to beginning of word
- `e`: go to end of word
- `y`: copy text
- `r`: replace letter in normal mode
- `p`: paste text
- `v`: to go into pseudo-visual mode
- `x`: delete a character and copy it
- `d`: delete line, character, word, etc...
- `c`: delete whatever, copy it, and go into insert mode
- `0`: go to the beginning of a line
- `$`: go to the end of a line

<figure>
<img src="https://i.imgur.com/C9Hdhkc.gif">
<figcaption>
Activating vim mode
</figcaption>
</figure>

Other things that work are basic navigation in visual mode, with copying,
pasting, and deleting. If you want to get out of visual mode, you just have
to hit escape, and you're back into normal mode. In the spirit of vim, the
only ways to get out of normal mode are to use keys that put you into 'insert'
mode, like `a`, `i`, `A`, `I`, `o`, `O`.

If something goes horribly wrong, and your system becomes royally messed up,
you can always reload your hammerspoon configuration to reset the state of
the program.

## How to configure

You can edit different aspects of the framework to customize your
needs more effectively. For instance, you could change the keymap that triggers
the transition into vim-mode to whatever bindings you wanted, or change which
keys had what effect in normal or visual mode. This is as simple as changing
which keys to refer to in the table lookup within the key event handler.

Generally, the system watches out for keypress events, and depending on the
state of the system, translates them from one set of keypress events to another,
corresponding to their actions in vim.

## Future improvements

- repeatable actions via numbers
- recording macros
- ex mode
- adding a status bar in the menu to let the user know current vim state

### ex mode

Because this is a semi-vim port layered on top of the OS, I can do some
fancy things with our implementation of ex mode. Not only can I add
application-specific commands like saving or quitting documents, but also
I can add commands to switch between workspaces or to open specific sets
of applications. I will try to build the ex-mode interface so that it can
easily be customized by end users to do anything they want.

## You can contribute too!

I am more than happy to accept help improving this package to be more comprehensive
and feature-rich! Please fork this [repo][vim] and do whatever you please to
improve it. Send a pull request if you feel your work should be included in the main
branch.

## Caveats

I could not implement all the greatest features of vim. There are things I may
have forgotten, or found too difficult for me to program. If you have a good
solution, please, contribute! Some examples: searching for text, marks.

[hammerspoon]: http://www.hammerspoon.org/
[vim]: https://github.com/wingillis/hammerspoon-vim-bindings
