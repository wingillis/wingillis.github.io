---
layout: post
title: Hammerspoon Vim Bindings
description: Tutorial on how to give all applications vim-like capabilities
---
# Hammerspoon Vim Bindings

If you're like me, you program a lot. And if you're like me, you program with
vim a lot. Frequently I'm finding myself goofing while using other applications,
such as Microsoft Word, or Evernote, and trying to select or delete regions of
text and instead typing unnecessary characters into my document. When I learned
of the power that [hammerspoon] provides me, I
realized that I could add this feature.

**Note:** this software only works for the macOS.

## How to install

1. Install [hammerspoon].
2. Download my [vim-bindings repository][vim].
3. Follow the brief installation instructions in the repository's README.
4. Test it out.

## How to use

The most important command to know is `option + escape` which is the entry into
vim mode from any application. Basic navigation commands work, like: `j`, `k`,
`l`, and `h` which code for: :arrow_down:, :arrow_up:, :arrow_right:, :arrow_left:, respectively.
Below are a list of commands that you should know for application control:
- `w`: go to beginning of word
- `r`: replace letter in normal mode
- `e`: go to end of word
- `y`: copy text
- `p`: paste text
- `i`: exit

If something goes horribly wrong, and your system becomes royally messed up,
you can always reload your hammerspoon configuration to reset the state of
the program.

## How to configure

You can easily edit different aspects of the framework to customize your
needs more effectively.

## What I want to add in the future

- repeatable actions via numbers
- recording macros
- ex mode: highly customized and gui-based; for saving files initially

## Caveats

I could not implement all the greatest features of vim. There are things I may
have forgotten, or found too difficult for me to program. If you have a good
solution, please, contribute! Some examples: searching for text, marks.

[hammerspoon]: http://www.hammerspoon.org/
[vim]: https://github.com/wingillis/hammerspoon-vim-bindings
