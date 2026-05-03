/*
File:       github.com/CBurg-College/sims.ts
Version:	2026-1
Copyright:  ElecTricks, 2026
License:    GNU GPL 3 or later
Disclaimer: Distributed without any warranty
Depends on: et-simon.ts
*/

//////////////////////
//  INCLUDE         //
//  et-ledstrip.ts  //
//////////////////////

enum NeopixelMode {
    GRB = 1,
    RGBW = 2,
    RGB = 3
}

namespace EtLedstrip {

    export class Device {

        pin: DigitalPin
        max: number
        mode: NeopixelMode
        buffer: Buffer
        size: number
        bright: number = 10

        constructor(pin: DigitalPin, leds: number, mode: NeopixelMode) {
            this.pin = pin
            this.max = leds
            this.mode = mode
            this.size = leds * (mode == NeopixelMode.RGBW ? 4 : 3)
            this.buffer = pins.createBuffer(this.size)
        }

        show() {
            light.sendWS2812Buffer(this.buffer, this.pin)
        }

        setPixelRGB(offset: number, red: number, green: number, blue: number, white: number = 0): void {
            offset *= (this.mode == NeopixelMode.RGBW ? 4 : 3)
            switch (this.mode) {
                case NeopixelMode.GRB:
                    this.buffer[offset + 0] = Math.floor(green * this.bright / 100)
                    this.buffer[offset + 1] = Math.floor(red * this.bright / 100);
                    this.buffer[offset + 2] = Math.floor(blue * this.bright / 100);
                    break;
                case NeopixelMode.RGB:
                    this.buffer[offset + 0] = Math.floor(red * this.bright / 100);
                    this.buffer[offset + 1] = Math.floor(green * this.bright / 100);
                    this.buffer[offset + 2] = Math.floor(blue * this.bright / 100);
                    break;
                case NeopixelMode.RGBW:
                    this.buffer[offset + 0] = Math.floor(red * this.bright / 100);
                    this.buffer[offset + 1] = Math.floor(green * this.bright / 100);
                    this.buffer[offset + 2] = Math.floor(blue * this.bright / 100);
                    this.buffer[offset + 3] = Math.floor(white * this.bright / 100);
                    break;
            }
        }

        setPixelColor(pixel: number, color: ETcolor, white: number = 0): void {
            if (pixel < 0 || pixel >= this.max)
                return;
            let rgb = etFromColor(color)
            let red = (rgb >> 16) & 0xFF;
            let green = (rgb >> 8) & 0xFF;
            let blue = (rgb) & 0xFF;
            this.setPixelRGB(pixel, red, green, blue, white)
        }

        setRGB(red: number, green: number, blue: number, white: number = 0) {
            for (let i = 0; i < this.max; ++i)
                this.setPixelRGB(i, red, green, blue, white)
        }

        setColor(color: ETcolor, white: number = 0) {
            let rgb = etFromColor(color)
            let red = (rgb >> 16) & 0xFF;
            let green = (rgb >> 8) & 0xFF;
            let blue = (rgb) & 0xFF;
            for (let i = 0; i < this.max; ++i)
                this.setPixelRGB(i, red, green, blue, white)
        }

        setClear(): void {
            this.buffer.fill(0, 0, this.size);
        }

        setBrightness(brightness: number) {
            if (brightness < 0) brightness = 0
            if (brightness > 100) brightness = 100
            // small steps at low brightness and big steps at high brightness
            brightness = (brightness * brightness / 100)
            this.bright = brightness
        }

        setRotate(rotation: ETrotate): void {
            let offset = (this.mode == NeopixelMode.RGBW ? 4 : 3)
            if (rotation == ETrotate.Clockwise)
                this.buffer.rotate(-offset, 0, this.size)
            else
                this.buffer.rotate(offset, 0, this.size)
        }

        rainbow(rotation: ETrotate, pace: ETpace = ETpace.Normal) {
            if (rotation == ETrotate.Clockwise) {
                this.setPixelColor(0, ETcolor.Red)
                this.setPixelColor(1, ETcolor.Orange)
                this.setPixelColor(2, ETcolor.Yellow)
                this.setPixelColor(3, ETcolor.Green)
                this.setPixelColor(4, ETcolor.Blue)
                this.setPixelColor(5, ETcolor.Indigo)
                this.setPixelColor(6, ETcolor.Violet)
                this.setPixelColor(7, ETcolor.Purple)
            }
            else {
                this.setPixelColor(7, ETcolor.Red)
                this.setPixelColor(6, ETcolor.Orange)
                this.setPixelColor(5, ETcolor.Yellow)
                this.setPixelColor(4, ETcolor.Green)
                this.setPixelColor(3, ETcolor.Blue)
                this.setPixelColor(2, ETcolor.Indigo)
                this.setPixelColor(1, ETcolor.Violet)
                this.setPixelColor(0, ETcolor.Purple)
            }
            this.show()
            basic.pause(pace)
            pace = (pace + 1) * 75
            for (let i = 0; i < this.max; i++) {
                this.setRotate(rotation)
                this.show()
                basic.pause(pace)
            }
        }

        snake(color: ETcolor, rotation: ETrotate, pace: ETpace = ETpace.Normal) {
            let rgb = etFromColor(color)
            let red = (rgb >> 16) & 0xFF;
            let green = (rgb >> 8) & 0xFF;
            let blue = (rgb) & 0xFF;
            this.setClear();
            this.show()
            pace = (pace + 1) * 75
            for (let i = this.max - 1; i >= 0; i--) {
                if (rotation == ETrotate.Clockwise)
                    this.setPixelRGB(this.max - i, red, green, blue)
                else
                    this.setPixelRGB(i, red, green, blue)
                this.show()
                basic.pause(pace)
            }
            this.show()
            for (let i = this.max - 1; i >= 0; i--) {
                if (rotation == ETrotate.Clockwise)
                    this.setPixelRGB(this.max - i, 0, 0, 0)
                else
                    this.setPixelRGB(i, 0, 0, 0)
                this.show()
                basic.pause(pace)
            }
            if (rotation == ETrotate.Clockwise)
                this.setPixelRGB(0, 0, 0, 0)
            else
                this.setPixelRGB(this.max, 0, 0, 0)
            this.show()
            basic.pause(pace)
        }
    }

    export function create(pin: DigitalPin, leds: number, mode: NeopixelMode = NeopixelMode.GRB): Device {
        let device = new Device(pin, leds, mode)
        return device
    }
}

///////////////////
//  END INCLUDE  //
///////////////////


let pinRed = DigitalPin.P0
let pinGreen = DigitalPin.P1
let pinBlue = DigitalPin.P2
pins.setPull(pinRed, PinPullMode.PullDown)
pins.setPull(pinGreen, PinPullMode.PullDown)
pins.setPull(pinBlue, PinPullMode.PullDown)

let leddev = EtLedstrip.create(DigitalPin.P8, 1)

function showRed() {
    leddev.setColor(ETcolor.Red)
    leddev.show()
}
EtSimon.registerOptionHandler(showRed)

function showGreen() {
    leddev.setColor(ETcolor.Green)
    leddev.show()
}
EtSimon.registerOptionHandler(showGreen)

function showBlue() {
    leddev.setColor(ETcolor.Blue)
    leddev.show()
}
EtSimon.registerOptionHandler(showBlue)

function clear() {
    leddev.setColor(ETcolor.Black)
    leddev.show()
}
EtSimon.registerClearHandler(clear)

function readButton(): number {
    if (pins.digitalReadPin(pinRed) === ET_HIGH) {
        while (pins.digitalReadPin(pinRed) === ET_HIGH) basic.pause(1)
        basic.pause(100) // debounce
        return 0
    }
    if (pins.digitalReadPin(pinGreen) === ET_HIGH) {
        while (pins.digitalReadPin(pinGreen) === ET_HIGH) basic.pause(1)
        basic.pause(100) // debounce
        return 1
    }
    if (pins.digitalReadPin(pinBlue) === ET_HIGH) {
        while (pins.digitalReadPin(pinBlue) === ET_HIGH) basic.pause(1)
        basic.pause(100) // debounce
        return 2
    }
    return -1
}
EtSimon.registerButtonHandler(readButton)
