/*
File:      github.com/ETmbit/sims-1.ts
Copyright: ETmbit, 2026

License:
This file is part of the ETmbit extensions for MakeCode for micro:bit.
It is free software and you may distribute it under the terms of the
GNU General Public License (version 3 or later) as published by the
Free Software Foundation. The full license text you find at
https://www.gnu.org/licenses.

Disclaimer:
ETmbit extensions are distributed without any warranty.

Dependencies:
ETmbit/general, ETmbit/simonsays
*/

//% color="#66AA22" icon="\uf111"
//% block="Simon Says"
//% block.loc.nl="Simon Says"
namespace SimSays {

    let ISGAMING = false

    //% block="show the points"
    //% block.loc.nl="toon de score"
    export function showPoints() {
        basic.clearScreen()
        let points = SimonSays.getPoints()
        basic.showNumber(points)
        if (points < 10) General.wait(2)
        SimonSays.clearColor()
        basic.showArrow(ArrowNames.West)
    }

    //% block="increase the points"
    //% block.loc.nl="verhoog de score"
    export function increasePoints() {
        SimonSays.increasePoints()
    }

    //% block="the wrong color was chosen"
    //% block.loc.nl="de verkeerde kleur werd gekozen"
    export function hasFailed(): boolean {
        return !SimonSays.isMatchingColor()
    }

    //% block="the right color was chosen"
    //% block.loc.nl="de juiste kleur werd gekozen"
    export function isSuccess(): boolean {
        return SimonSays.isMatchingColor()
    }

    //% block="the chosen color"
    //% block.loc.nl="de gekozen kleur"
    export function getButtonColor(): Color {
        return SimonSays.getButtonColor()
    }

    //% block="wait until a color is chosen"
    //% block.loc.nl="wacht tot een kleur wordt gekozen"
    export function waitForButton() {
        SimonSays.waitForButton()
    }

    //% block="the displayed color"
    //% block.loc.nl="de getoonde kleur"
    export function getLedColor(): Color {
        return SimonSays.getCurrentColor()
    }

    //% block="ask the next color"
    //% block.loc.nl="vraag de volgende kleur"
    export function checkNextColor() {
        SimonSays.setNextColor()
    }

    //% block="ask the first color"
    //% block.loc.nl="vraag de eerste kleur"
    export function checkFirstColor() {
        SimonSays.clearColor()
        basic.clearScreen()
        General.wait(0.5)
        basic.showIcon(IconNames.Heart)
        SimonSays.setFirstColor()
    }

    //% block="ask all colors"
    //% block.loc.nl="vraag alle kleuren"
    export function checkAllColors() {
        SimSays.checkFirstColor()
        while (SimSays.isInSeries()) {
            SimonSays.waitForButton()
            if (SimonSays.isMatchingColor()) {
                SimonSays.increasePoints()
                SimonSays.setNextColor()
            }
            else
                SimSays.stopGame()
        }
    }

    //% block="show the next color"
    //% block.loc.nl="toon de volgende kleur"
    export function showNextColor() {
        SimonSays.setNextColor()
        SimonSays.showCurrentColor()
        General.wait(0.5)
        SimonSays.clearColor()
        General.wait(0.2)
    }

    //% block="show the first color"
    //% block.loc.nl="toon de eerste kleur"
    export function showFirstColor() {
        basic.showIcon(IconNames.SmallHeart)
        General.wait(0.5)
        SimonSays.setFirstColor()
        SimonSays.showCurrentColor()
        General.wait(0.3)
        SimonSays.clearColor()
        General.wait(0.2)
    }

    //% block="show all colors"
    //% block.loc.nl="toon alle kleuren"
    export function showAllColors() {
        SimSays.showFirstColor()
        while (SimSays.isInSeries())
            SimSays.showNextColor()
    }

    //% block="append the series with a color"
    //% block.loc.nl="voeg een kleur aan de serie toe"
    export function appendColor() {
        SimonSays.extendSeries()
    }

    //% block="the next color is required"
    //% block.loc.nl="de volgende kleur nodig is"
    export function isSeriesEnd(): boolean {
        return (ISGAMING && SimonSays.isSeriesEnd())
    }

    //% block="still continuing the series"
    //% block.loc.nl="nog met de serie bezig"
    export function isInSeries(): boolean {
        return (ISGAMING && SimonSays.isSeriesBusy())
    }

    //% block="the next color is required"
    //% block.loc.nl="de volgende kleur nodig is"
    export function restartSeries() {
        SimonSays.restartSeries()
    }

    //% block="the game is busy"
    //% block.loc.nl="het spel bezig is"
    export function isGaming(): boolean {
        return ISGAMING
    }

    //% block="stop the game"
    //% block.loc.nl="stop het spel"
    export function stopGame() {
        basic.showIcon(IconNames.Sad)
        ISGAMING = false
    }

    //% block="start the game"
    //% block.loc.nl="start het spel"
    export function startGame() {
        SimonSays.clearSeries()
        ISGAMING = true
    }
}

basic.showArrow(ArrowNames.West)
