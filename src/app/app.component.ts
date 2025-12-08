import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import ielts from '../assets/det/output.json';
import deployTime from '../assets/det/deploy_time.json';
import { WordService } from './services/word.service';

interface Word {
  id: number;
  en1: string;
  en2: string;
  en3: string;
  en4: string;
  vn1: string;
  speakSentenceCountMax?: number;
  speakWordCountMax?: number;
  page?: number;
  hide?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // Main counter (300 -> 0)
  counter = 300;


  // inner second within current 10s cycle (0..10). We'll display from 1..10 for users.
  innerSec = 0; // increments each 1s tick to 1..10


  // running state
  running = false;


  private tickHandle: any = null; // interval handle for 1s ticks


  // convenience displays
  get innerSecDisplay() { return this.innerSec === 0 ? 0 : this.innerSec; }


  // cycles info
  get totalCycles() { return 301; } // from 300 down to 0 inclusive -> 301 cycles
  get cycleNumber() { return this.totalCycles - this.counter; }


  voices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | null = null;
  ngOnInit(): void {
    // optional: autostart
    // this.start();

    this.voices = speechSynthesis.getVoices();
    setTimeout(() => {
      this.voices = speechSynthesis.getVoices();
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


    // if innerSec is 0, we are at the start of a new 10s cycle; we'll begin ticking.
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
    // increase inner second
    this.innerSec++;


    // At innerSec == 1 -> first second of the 10s period (play "Hít")
    if (this.innerSec === 1) {
      await this.speak('Hít vào');
    }


    // At innerSec == 6 -> play "Thở"
    if (this.innerSec === 6) {
      await this.speak('Thở ra');
    }


    // When innerSec reaches 10, that means 10 seconds finished for the current displayed number -> decrement counter
    if (this.innerSec >= 10) {
      // decrement counter (but ensure it doesn't go negative)
      if (this.counter > 0) {
        this.counter--;
      }


      // reset innerSec for next cycle
      this.innerSec = 0;


      // If we've reached 0, stop
      if (this.counter <= 0) {
        this.pause();
      }
    }
  }

  async speak(text: string) {

    const utterance = new SpeechSynthesisUtterance(text);
    // prefer Vietnamese voice when available
    utterance.lang = 'vi-VN';
    utterance.voice = this.selectedVoice;
    // slightly faster voice for short words
    utterance.rate = 0.1;
    // cancel any pending short utterances to keep timing predictable
    // window.speechSynthesis.cancel();
    // window.speechSynthesis.speak(utter);

    speechSynthesis.speak(utterance);

  }
  // async speakWord() {

  //   var utterance = new SpeechSynthesisUtterance(this.enWord1);
  //   utterance.lang = 'en-US';
  //   utterance.voice = this.selectedVoice;
  //   utterance.rate = this.selectedRate;
  //   if (this.isAuto) {
  //     utterance.onend = async (event) => {
  //       if (this.speakWordCount > this.speakWordCountMax) {
  //         this.speakWordCount = 0;
  //         this.change();
  //         await this.sleep();
  //         await this.speakSentence();
  //       } else {
  //         await this.sleep();
  //         await this.speakWord();
  //       };
  //     };
  //   };
  //   speechSynthesis.speak(utterance);
  // };






  // showEn = true;
  // showVN = false;
  // no = 1;
  // vnWord1 = '';
  // enWord1 = '';
  // enWord2 = '';
  // enWord3 = '';
  // enWord4 = '';
  // page = 0;
  // textxtx = '';
  // words: Word[] = [];
  // learnedWords: Word[] = [];
  // countSawWords = 0;
  // tempWord: any;
  // deployT = deployTime.time;
  // isAuto = false;
  // timeSleep = 1000;

  // selectedWord: Word = {
  //   id: 0,
  //   en1: '',
  //   en2: '',
  //   en3: '',
  //   en4: '',
  //   vn1: '',
  //   speakSentenceCountMax: 0,
  //   speakWordCountMax: 0,
  //   page: 0,
  // };

  // // speak
  // selectedVoice: SpeechSynthesisVoice | null = null;
  // voices: SpeechSynthesisVoice[] = [];
  // selectedRate: number = 1;
  // canSpeak: boolean = true;

  // constructor(private wordService: WordService, private cdr: ChangeDetectorRef) {
  //   this.wordService.getWords().subscribe({
  //     next: data => {
  //       // API
  //       this.words = data;
  //       this.setupWord();
  //     },
  //     error: err => {
  //       // Deploy
  //       console.error('Error fetching words:', err);
  //       this.words = this.words.concat(ielts);
  //       // this.learnedWords = this.words.slice(10, 19);
  //       this.setupWord();
  //     }
  //   });
  // };

  // ngOnInit(): void {
  //   this.voices = speechSynthesis.getVoices().filter(x => x.lang === "en-US");
  //   setTimeout(() => {
  //     this.voices = speechSynthesis.getVoices().filter(x => x.lang === "en-US");
  //     if (this.voices.length >= 29) {
  //       this.selectedVoice = this.voices[28];
  //     } else {
  //       this.selectedVoice = this.voices[0];
  //     }
  //   }, 500);
  // };

  // setupWord(): void {
  //   this.tempWord = this.removeRandomElement(this.words)
  //   this.words = this.shuffleItems(this.tempWord.updatedArray);

  //   if (this.tempWord.removedElement) {
  //     this.selectedWord = this.tempWord.removedElement;
  //     this.vnWord1 = this.tempWord.removedElement.vn1;
  //     this.enWord1 = this.tempWord.removedElement.en1;
  //     this.enWord2 = this.tempWord.removedElement.en2;
  //     this.enWord3 = this.tempWord.removedElement.en3;
  //     this.enWord4 = this.tempWord.removedElement.en4;
  //     this.speakSentenceCountMax = this.tempWord.removedElement.speakSentenceCountMax;
  //     this.speakWordCountMax = this.tempWord.removedElement.speakWordCountMax;
  //     this.page = this.tempWord.removedElement.page;
  //     this.tempWord.removedElement.hide = true;
  //     this.learnedWords.push(this.tempWord.removedElement);
  //     if (this.learnedWords.length === 10) {
  //       this.isAuto = false;
  //     }
  //   } else {
  //     this.selectedWord = {
  //       id: 0,
  //       en1: '',
  //       en2: '',
  //       en3: '',
  //       en4: '',
  //       vn1: '',
  //       speakSentenceCountMax: 0,
  //       speakWordCountMax: 0,
  //     };
  //     this.vnWord1 = "";
  //     this.enWord1 = "";
  //     this.enWord2 = "";
  //     this.enWord3 = "";
  //     this.enWord4 = "";
  //     this.page = 0;
  //   };
  // };

  // clearAndSuffleLearnedWords() {
  //   this.learnedWords.forEach(word => word.hide = true);
  //   if (this.learnedWords.length > 1) {
  //     const itemsToShuffle = this.learnedWords.slice(0, -1);
  //     const shuffledItems = this.shuffleItems(itemsToShuffle);
  //     this.learnedWords = [...shuffledItems, this.learnedWords[this.learnedWords.length - 1]];
  //   }
  //   this.cdr.detectChanges();
  // }

  // cleanLearnedWords() {
  //   this.learnedWords = [this.learnedWords[this.learnedWords.length - 1]];
  // }

  // shuffleItems<T>(items: T[]): T[] {
  //   for (let i = items.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [items[i], items[j]] = [items[j], items[i]];
  //   }
  //   return items;
  // }

  // // API
  // markAsStudied(id: number): void {
  //   // this.wordService.markStudied(id).subscribe({
  //   //   next: () => {
  //   //   },
  //   //   error: err => console.error('Error updating studied status:', err)
  //   // });
  // };

  // renderEnWord = (value: string): string => {
  //   if (!this.showVN) {
  //     let words = value.split(',');
  //     return words[0];
  //   };
  //   return value;
  // };

  // change() {
  //   if (!this.showVN) {
  //     this.showVN = true;
  //   };
  //   if (!this.showEn) {
  //     this.showEn = true;
  //   };
  //   this.cdr.detectChanges();
  // };

  // next() {
  //   this.markAsStudied(this.selectedWord.id)
  //   this.textxtx = '';
  //   this.countSawWords += 1;
  //   this.no = this.no * -1;
  //   this.showVN = this.no > 0;

  //   // this.see = !this.show; // Chỉ xuất hiện tiếng anh trước
  //   this.showVN = false;
  //   this.showEn = true;

  //   this.setupWord();
  //   this.cdr.detectChanges();
  // };

  // removeRandomElement<T>(arr: T[]): { updatedArray: T[], removedElement: T | undefined } {
  //   if (arr.length === 0) {
  //     return { updatedArray: arr, removedElement: undefined };
  //   };
  //   const randomIndex = Math.floor(Math.random() * arr.length);
  //   const removedElement = arr[randomIndex];
  //   arr.splice(randomIndex, 1);
  //   return { updatedArray: arr, removedElement };
  // };

  // deleteLearnedWord(id: any) {
  //   this.learnedWords = this.learnedWords.filter(word => word.id !== id);
  //   this.cdr.detectChanges();
  // }

  // toggleHideLearnedWord(id: any) {
  //   const word = this.learnedWords.find(word => word.id === id);
  //   if (word) {
  //     word.hide = !word.hide;
  //     this.cdr.detectChanges();
  //   }
  // }

  // speakWordCount = 0;
  // speakWordCountMax = 1;
  // async speakWord() {
  //   this.speakWordCount += 1;
  //   var utterance = new SpeechSynthesisUtterance(this.enWord1);
  //   utterance.lang = 'en-US';
  //   utterance.voice = this.selectedVoice;
  //   utterance.rate = this.selectedRate;
  //   if (this.isAuto) {
  //     utterance.onend = async (event) => {
  //       if (this.speakWordCount > this.speakWordCountMax) {
  //         this.speakWordCount = 0;
  //         this.change();
  //         await this.sleep();
  //         await this.speakSentence();
  //       } else {
  //         await this.sleep();
  //         await this.speakWord();
  //       };
  //     };
  //   };
  //   speechSynthesis.speak(utterance);
  // };

  // speakSentenceCount = 0;
  // speakSentenceCountMax = 5;
  // async speakSentence() {
  //   this.speakSentenceCount += 1;
  //   var utterance = new SpeechSynthesisUtterance(this.enWord2);
  //   utterance.lang = 'en-US';
  //   utterance.voice = this.selectedVoice;
  //   utterance.rate = this.selectedRate;
  //   if (this.isAuto) {
  //     utterance.onend = async (event) => {
  //       if (this.speakSentenceCount > this.speakSentenceCountMax) {
  //         this.speakSentenceCount = 0;
  //         this.next();
  //         await this.sleep();
  //         await this.speakWord();
  //       } else {
  //         await this.sleep();
  //         await this.speakSentence();
  //       };
  //     };
  //   };
  //   speechSynthesis.speak(utterance);
  // };

  // checkAbleSpeak() {
  //   this.voices = window.speechSynthesis
  //     .getVoices()
  //     .filter((voice) => voice.lang == 'en-US');
  //   if (this.voices.length > 0) {
  //     this.selectedVoice = this.voices[0];
  //     this.canSpeak = true;
  //   };
  // };

  // sleep(): Promise<void> {
  //   return new Promise(resolve => setTimeout(resolve, this.timeSleep));
  // };
}
