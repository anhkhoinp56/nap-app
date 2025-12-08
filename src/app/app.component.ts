import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  counter = 200;
  innerSec = 0;
  running = false;
  tickHandle: any = null;

  get innerSecDisplay() { return this.innerSec === 0 ? 0 : this.innerSec; }
  get totalCycles() { return 301; }
  get cycleNumber() { return this.totalCycles - this.counter; }

  voices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | null = null;
  ngOnInit(): void {
    this.voices = speechSynthesis.getVoices().filter(x => x.lang === "vi-VN");
    setTimeout(() => {
      this.voices = speechSynthesis.getVoices().filter(x => x.lang === "vi-VN");
      if (this.voices.length >= 29) {
        this.selectedVoice = this.voices[28];
      } else {
        this.selectedVoice = this.voices[0];
      }
    }, 500);
  }

  ngOnDestroy(): void {
    this.stopInterval();
  }

  start() {
    if (this.running) return;
    if (this.counter <= 0) return;
    this.running = true;

    this.tickHandle = setInterval(() => {
      (async () => {
        await this.onTick();
      })();
    }, 1000);
  }

  pause() {
    this.running = false;
    this.stopInterval();
  }

  reset() {
    this.pause();
    this.counter = 300;
    this.innerSec = 0;
  }

  private stopInterval() {
    if (this.tickHandle) {
      clearInterval(this.tickHandle);
      this.tickHandle = null;
    }
  }

  async onTick() {
    this.innerSec++;

    if (this.innerSec === 1) {
      await this.speak('Hít vào');
    }

    if (this.innerSec === 6) {
      await this.speak('Thở ra');
    }

    if (this.innerSec >= 10) {
      if (this.counter > 0) {
        this.counter--;
      }

      this.innerSec = 0;

      if (this.counter <= 0) {
        this.pause();
      }
    }
  }

  async test() {
    await this.speak('Xin chào bạn');
  }

  async speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.voice = this.selectedVoice;
    utterance.rate = 0.5;
    speechSynthesis.speak(utterance);
  }
}
