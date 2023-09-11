import {Component, OnInit} from '@angular/core';

declare const window: any;



@Component({
    selector: 'app-message-preview',
    templateUrl: './message-preview.component.html',
    styleUrls: ['./message-preview.component.scss']
})
export class MessagePreviewComponent implements OnInit {
    canvas: any;
    context: any;
    W: any;
    H: any;
    x: number;
    y: number;
    r: number;
    d: number;
    color: string;
    tilt: number;
    tiltAngleIncremental: number;
    tiltAngle: number;
    maxConfettis: number = 40;
    particles: any = [];
    possibleColors: any = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Gold",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson"
];

    constructor() {
        this.W = window.innerWidth;
        this.H = window.innerHeight;
        this.x = Math.random() * this.W; // x
        this.y = Math.random() * this.H - this.H; // y
        this.r = this.randomFromTo(11, 33); // radius
        this.d = Math.random() * this.maxConfettis + 11;
        this.color = this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)];
        this.tilt = Math.floor(Math.random() * 33) - 11;
        this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
        this.tiltAngle = 0;
    }

    ngOnInit(): void {
        // this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        // this.context = this.canvas.getContext("2d");
        // // Initialize
        // this.canvas.width = this.W;
        // this.canvas.height = this.H;
        // for (var i = 0; i < this.maxConfettis; i++) {
        //     this.particles.push(this.confettiParticle());
        // }
        //this.Draw();

    }
    confettiParticle() {
        this.x = Math.random() * this.W; // x
        this.y = Math.random() * this.H - this.H; // y
        this.r = this.randomFromTo(11, 33); // radius
        this.d = Math.random() * this.maxConfettis + 11;
        this.color =
            this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)];
        this.tilt = Math.floor(Math.random() * 33) - 11;
        this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
        this.tiltAngle = 0;

        this.draw()
    }
    draw(): void {
        if (this.context) {
            this.context.beginPath();
            this.context.lineWidth = this.r / 2;
            this.context.strokeStyle = this.color;
            this.context.moveTo(this.x + this.tilt + this.r / 3, this.y);
            this.context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
            return this.context.stroke();
        }
    }
    randomFromTo(from: any, to: any) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }
    Draw(): void {
        const results: void[] = [];

        // Magical recursive functional love
        requestAnimationFrame(this.Draw);

        if (this.context) {
            this.context.clearRect(0, 0, this.W, window.innerHeight);

            for (let i = 0; i < this.maxConfettis; i++) {
                //results.push(particles[i].draw());
            }

            let particle: any;
            let remainingFlakes: number = 0;
            for (let i = 0; i < this.maxConfettis; i++) {
                particle = this.particles[i];

                this.tiltAngle += particle.tiltAngleIncremental;
                particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
                particle.tilt = Math.sin(this.tiltAngle - i / 3) * 15;

                if (particle.y <= this.H) remainingFlakes++;

                // If a confetti has fluttered out of view,
                // bring it back above the viewport and let it re-fall.
                if (particle.x > this.W + 30 || particle.x < -30 || particle.y > this.H) {
                    particle.x = Math.random() * this.W;
                    particle.y = -30;
                    particle.tilt = Math.floor(Math.random() * 10) - 20;
                }
            }
        }
    }


}





