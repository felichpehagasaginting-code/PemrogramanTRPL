// Lightweight Keystroke & Code Timeline Recorder for student problem-solving analytics

export interface KeystrokeEvent {
  timestamp: number;
  deltaMs: number;
  code: string;
  charCount: number;
  isPaste?: boolean;
}

export interface KeystrokeSession {
  sessionId: string;
  studentId: string;
  moduleId: string;
  startTime: number;
  endTime?: number;
  totalEvents: number;
  hasPasteBurst: boolean;
  events: KeystrokeEvent[];
}

export class KeystrokeRecorder {
  private events: KeystrokeEvent[] = [];
  private startTime: number = Date.now();
  private lastTime: number = Date.now();
  private lastCode: string = "";
  private moduleId: string;
  private studentId: string;
  private hasPasteBurst: boolean = false;

  constructor(moduleId: string, studentId: string = "maba-user") {
    this.moduleId = moduleId;
    this.studentId = studentId;
    this.reset();
  }

  public reset() {
    this.events = [];
    this.startTime = Date.now();
    this.lastTime = Date.now();
    this.lastCode = "";
    this.hasPasteBurst = false;
  }

  public recordChange(newCode: string) {
    if (newCode === this.lastCode) return;

    const now = Date.now();
    const deltaMs = now - this.lastTime;
    const charDiff = Math.abs(newCode.length - this.lastCode.length);

    // Detect large instant insertion (Paste burst)
    const isPaste = charDiff > 15 && deltaMs < 300;
    if (isPaste) {
      this.hasPasteBurst = true;
    }

    const event: KeystrokeEvent = {
      timestamp: now,
      deltaMs: this.events.length === 0 ? 0 : deltaMs,
      code: newCode,
      charCount: newCode.length,
      isPaste,
    };

    this.events.push(event);
    this.lastTime = now;
    this.lastCode = newCode;
  }

  public getSessionData(): KeystrokeSession {
    return {
      sessionId: `session-${this.moduleId}-${this.startTime}`,
      studentId: this.studentId,
      moduleId: this.moduleId,
      startTime: this.startTime,
      endTime: this.lastTime,
      totalEvents: this.events.length,
      hasPasteBurst: this.hasPasteBurst,
      events: this.events,
    };
  }
}
