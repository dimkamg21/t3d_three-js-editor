import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
    constructor() {
        super();

        // Setup
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    tick() {
        const currentTime = Date.now();
        this.delta = (currentTime - this.current) / 1000;
        this.current = currentTime;
        this.elapsed = currentTime - this.start;

        this.trigger('tick');

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}
