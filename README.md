# frame

[WIP] Minumum viable digital design app

[![CircleCI](https://circleci.com/gh/seanchas116/frame.svg?style=svg)](https://circleci.com/gh/seanchas116/frame) [![codecov](https://codecov.io/gh/seanchas116/frame/branch/master/graph/badge.svg)](https://codecov.io/gh/seanchas116/frame)


## What to do

* Drawing rectangles, ellipses, triangles and texts
* Add images and SVG shapes
* Color / gradient fill and stroke
* Simple palette management
* Simple alignment and snapping
* Import and export SVGs

## Future work

* Better format support (PSD / Sketch / PDF ...)
* Design handoff features (Generating CSS, ...)

## Code Structure

* `src` - Source files
  * `app`
    * Modules that forms app (modules inside `app` should not refer to each other)
  * `core`
    * Core modules that are referred from `app` modules
  * `lib`
    * Convenient utilities that does not form the app directly
