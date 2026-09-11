import type { BehavioralMetrics } from '../types/npc';

export interface MotionPoint {
  x: number;
  y: number;
  time: number;
  intensity: number;
}

export interface VisionBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  detected: boolean;
  confidence: number;
}

export class VisionEngine {
  private processingCanvas: HTMLCanvasElement;
  private processingCtx: CanvasRenderingContext2D | null;
  private prevFrameData: Uint8ClampedArray | null = null;
  
  // Motion history
  private motionHistory: MotionPoint[] = [];
  private velocityHistory: number[] = [];
  private angleHistory: number[] = [];
  private idleFrameCount: number = 0;
  private totalFrameCount: number = 0;
  private directionChangeCount: number = 0;

  // Smoothing
  private smoothedMetrics: BehavioralMetrics = {
    movementRandomness: 45,
    pathRepetition: 50,
    idleBehavior: 30,
    directionChanges: 40,
    activityLevel: 45,
    movementRepetition: 40,
    predictability: 50,
    loopDetected: false,
  };

  private currentBox: VisionBoundingBox = {
    x: 0.25,
    y: 0.2,
    width: 0.5,
    height: 0.6,
    detected: false,
    confidence: 0,
  };

  constructor() {
    this.processingCanvas = document.createElement('canvas');
    this.processingCanvas.width = 160;
    this.processingCanvas.height = 120;
    this.processingCtx = this.processingCanvas.getContext('2d', { willReadFrequently: true });
  }

  public reset() {
    this.prevFrameData = null;
    this.motionHistory = [];
    this.velocityHistory = [];
    this.angleHistory = [];
    this.idleFrameCount = 0;
    this.totalFrameCount = 0;
    this.directionChangeCount = 0;
    this.currentBox = {
      x: 0.25,
      y: 0.2,
      width: 0.5,
      height: 0.6,
      detected: false,
      confidence: 0,
    };
  }

  /**
   * Process a single video frame and update real-time metrics
   */
  public processVideoFrame(video: HTMLVideoElement): {
    metrics: BehavioralMetrics;
    boundingBox: VisionBoundingBox;
    trail: MotionPoint[];
  } {
    if (!this.processingCtx || video.readyState < 2 || video.videoWidth === 0) {
      return {
        metrics: this.smoothedMetrics,
        boundingBox: this.currentBox,
        trail: this.motionHistory.slice(-25),
      };
    }

    const w = this.processingCanvas.width;
    const h = this.processingCanvas.height;

    this.processingCtx.drawImage(video, 0, 0, w, h);
    const frame = this.processingCtx.getImageData(0, 0, w, h);
    const data = frame.data;
    const len = data.length;

    this.totalFrameCount++;

    if (!this.prevFrameData) {
      this.prevFrameData = new Uint8ClampedArray(data);
      return {
        metrics: this.smoothedMetrics,
        boundingBox: this.currentBox,
        trail: this.motionHistory,
      };
    }

    let diffCount = 0;
    let sumX = 0;
    let sumY = 0;
    let minX = w;
    let maxX = 0;
    let minY = h;
    let maxY = 0;
    const threshold = 28; // Pixel brightness delta threshold

    for (let i = 0; i < len; i += 4) {
      // Grayscale luminescence calculation
      const rDiff = Math.abs(data[i] - this.prevFrameData[i]);
      const gDiff = Math.abs(data[i + 1] - this.prevFrameData[i + 1]);
      const bDiff = Math.abs(data[i + 2] - this.prevFrameData[i + 2]);
      const delta = (rDiff + gDiff + bDiff) / 3;

      if (delta > threshold) {
        diffCount++;
        const pixelIdx = i / 4;
        const px = pixelIdx % w;
        const py = Math.floor(pixelIdx / w);

        sumX += px;
        sumY += py;

        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }
    }

    // Save current frame for next comparison
    this.prevFrameData.set(data);

    const totalPixels = w * h;
    const motionFraction = diffCount / totalPixels;

    let centroidX = 0.5;
    let centroidY = 0.5;

    if (diffCount > 0) {
      centroidX = sumX / diffCount / w;
      centroidY = sumY / diffCount / h;
    }

    // Smooth bounding box
    if (diffCount > 50) {
      const targetX = Math.max(0.05, minX / w);
      const targetY = Math.max(0.05, minY / h);
      const targetW = Math.min(0.9, (maxX - minX) / w + 0.1);
      const targetH = Math.min(0.9, (maxY - minY) / h + 0.1);

      this.currentBox = {
        x: this.currentBox.x * 0.7 + targetX * 0.3,
        y: this.currentBox.y * 0.7 + targetY * 0.3,
        width: this.currentBox.width * 0.7 + targetW * 0.3,
        height: this.currentBox.height * 0.7 + targetH * 0.3,
        detected: true,
        confidence: Math.min(0.98, 0.4 + motionFraction * 8),
      };
    } else {
      this.currentBox.confidence = Math.max(0, this.currentBox.confidence - 0.05);
      if (this.currentBox.confidence < 0.15) {
        this.currentBox.detected = false;
      }
    }

    // Record motion trajectory point
    const now = Date.now();
    const lastPoint = this.motionHistory[this.motionHistory.length - 1];

    if (diffCount > 20) {
      this.motionHistory.push({
        x: centroidX,
        y: centroidY,
        time: now,
        intensity: Math.min(1, motionFraction * 15),
      });

      if (lastPoint) {
        const dx = centroidX - lastPoint.x;
        const dy = centroidY - lastPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.velocityHistory.push(dist);

        const angle = Math.atan2(dy, dx);
        if (this.angleHistory.length > 0) {
          const lastAngle = this.angleHistory[this.angleHistory.length - 1];
          let angleDiff = Math.abs(angle - lastAngle);
          if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
          if (angleDiff > Math.PI / 4 && dist > 0.015) {
            this.directionChangeCount++;
          }
        }
        this.angleHistory.push(angle);
      }
    } else {
      this.idleFrameCount++;
    }

    // Keep history capped
    if (this.motionHistory.length > 120) this.motionHistory.shift();
    if (this.velocityHistory.length > 120) this.velocityHistory.shift();
    if (this.angleHistory.length > 120) this.angleHistory.shift();

    // Calculate real-time metrics
    const activityRaw = Math.min(100, motionFraction * 400);
    const idleRaw = Math.min(100, (this.idleFrameCount / Math.max(1, this.totalFrameCount)) * 100);

    // Direction changes rate
    const dirChangeRate = (this.directionChangeCount / Math.max(1, this.totalFrameCount)) * 400;
    const dirChangesRaw = Math.min(100, Math.max(5, dirChangeRate));

    // Path repetition and loop detection via spatial recurrence
    let repetitionScore = 40;
    let loopDetected = false;

    if (this.motionHistory.length > 20) {
      const recent = this.motionHistory.slice(-40);
      let backAndForthCounter = 0;
      for (let j = 4; j < recent.length; j += 4) {
        const p1 = recent[j];
        const p0 = recent[j - 4];
        if (Math.abs(p1.x - p0.x) < 0.08 && Math.abs(p1.y - p0.y) < 0.08) {
          backAndForthCounter++;
        }
      }
      repetitionScore = Math.min(98, (backAndForthCounter / (recent.length / 4)) * 100 + (idleRaw > 70 ? 30 : 10));
      if (repetitionScore > 65 || (idleRaw > 80)) {
        loopDetected = true;
      }
    }

    // Movement Randomness: high when angle variance is high & velocity erratic
    let randomnessRaw = 50;
    if (this.velocityHistory.length > 10) {
      const avgVel = this.velocityHistory.reduce((a, b) => a + b, 0) / this.velocityHistory.length;
      const velVariance = this.velocityHistory.reduce((a, b) => a + Math.pow(b - avgVel, 2), 0) / this.velocityHistory.length;
      randomnessRaw = Math.min(96, Math.max(6, Math.sqrt(velVariance) * 1500 + dirChangesRaw * 0.4 - repetitionScore * 0.4));
    }

    const predictabilityRaw = Math.min(98, Math.max(5, 100 - randomnessRaw * 0.8 + repetitionScore * 0.2));
    const moveRepetitionRaw = Math.min(98, Math.max(5, repetitionScore * 0.7 + (100 - randomnessRaw) * 0.3));

    // Smooth with previous values for pleasant UI display
    const alpha = 0.15;
    this.smoothedMetrics = {
      movementRandomness: Math.round(this.smoothedMetrics.movementRandomness * (1 - alpha) + randomnessRaw * alpha),
      pathRepetition: Math.round(this.smoothedMetrics.pathRepetition * (1 - alpha) + repetitionScore * alpha),
      idleBehavior: Math.round(this.smoothedMetrics.idleBehavior * (1 - alpha) + idleRaw * alpha),
      directionChanges: Math.round(this.smoothedMetrics.directionChanges * (1 - alpha) + dirChangesRaw * alpha),
      activityLevel: Math.round(this.smoothedMetrics.activityLevel * (1 - alpha) + activityRaw * alpha),
      movementRepetition: Math.round(this.smoothedMetrics.movementRepetition * (1 - alpha) + moveRepetitionRaw * alpha),
      predictability: Math.round(this.smoothedMetrics.predictability * (1 - alpha) + predictabilityRaw * alpha),
      loopDetected,
    };

    return {
      metrics: this.smoothedMetrics,
      boundingBox: this.currentBox,
      trail: this.motionHistory.slice(-25),
    };
  }

  /**
   * Draw futuristic HUD overlays onto the main display canvas
   */
  public drawHUDOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    boundingBox: VisionBoundingBox,
    trail: MotionPoint[],
    isScanning: boolean,
    fps: number
  ) {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw subtle coordinate grid markers
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // 2. Draw Motion Optical Flow Trail
    if (trail.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 255, 102, 0.4)';
      ctx.lineWidth = 2;
      for (let i = 0; i < trail.length; i++) {
        const pt = trail[i];
        const tx = pt.x * width;
        const ty = pt.y * height;
        if (i === 0) {
          ctx.moveTo(tx, ty);
        } else {
          ctx.lineTo(tx, ty);
        }
      }
      ctx.stroke();

      // Draw point blips
      trail.slice(-6).forEach((pt, i) => {
        const radius = (i + 1) * 0.8;
        ctx.fillStyle = i === trail.length - 1 ? '#00ff66' : 'rgba(0, 240, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(pt.x * width, pt.y * height, radius + 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 3. Draw Subject Bounding Box & Target HUD Brackets
    if (boundingBox.detected || isScanning) {
      const bx = boundingBox.x * width;
      const by = boundingBox.y * height;
      const bw = boundingBox.width * width;
      const bh = boundingBox.height * height;
      const bracketSize = Math.min(24, bw * 0.25);

      ctx.strokeStyle = boundingBox.detected ? '#00ff66' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.shadowColor = boundingBox.detected ? 'rgba(0, 255, 102, 0.8)' : 'rgba(245, 158, 11, 0.8)';
      ctx.shadowBlur = 8;

      // Top-Left bracket
      ctx.beginPath();
      ctx.moveTo(bx, by + bracketSize);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx + bracketSize, by);
      ctx.stroke();

      // Top-Right bracket
      ctx.beginPath();
      ctx.moveTo(bx + bw - bracketSize, by);
      ctx.lineTo(bx + bw, by);
      ctx.lineTo(bx + bw, by + bracketSize);
      ctx.stroke();

      // Bottom-Left bracket
      ctx.beginPath();
      ctx.moveTo(bx, by + bh - bracketSize);
      ctx.lineTo(bx, by + bh);
      ctx.lineTo(bx + bracketSize, by + bh);
      ctx.stroke();

      // Bottom-Right bracket
      ctx.beginPath();
      ctx.moveTo(bx + bw - bracketSize, by + bh);
      ctx.lineTo(bx + bw, by + bh);
      ctx.lineTo(bx + bw, by + bh - bracketSize);
      ctx.stroke();

      // Center crosshair inside target box
      const cx = bx + bw / 2;
      const cy = by + bh / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx, cy + 8);
      ctx.stroke();

      // Subject Tag Above Box
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(7, 9, 14, 0.85)';
      ctx.fillRect(bx, Math.max(10, by - 22), 120, 18);
      ctx.strokeStyle = '#00ff66';
      ctx.strokeRect(bx, Math.max(10, by - 22), 120, 18);

      ctx.fillStyle = '#00ff66';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`TARGET: SUB-01 [${Math.round(boundingBox.confidence * 100)}%]`, bx + 6, Math.max(10, by - 22) + 13);
    }

    // 4. Camera HUD Corners & Watermarks
    ctx.shadowBlur = 0;
    const pad = 16;
    const cornerL = 20;
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.4)';
    ctx.lineWidth = 1.5;

    // TL
    ctx.beginPath();
    ctx.moveTo(pad, pad + cornerL);
    ctx.lineTo(pad, pad);
    ctx.lineTo(pad + cornerL, pad);
    ctx.stroke();

    // TR
    ctx.beginPath();
    ctx.moveTo(width - pad - cornerL, pad);
    ctx.lineTo(width - pad, pad);
    ctx.lineTo(width - pad, pad + cornerL);
    ctx.stroke();

    // BL
    ctx.beginPath();
    ctx.moveTo(pad, height - pad - cornerL);
    ctx.lineTo(pad, height - pad);
    ctx.lineTo(pad + cornerL, height - pad);
    ctx.stroke();

    // BR
    ctx.beginPath();
    ctx.moveTo(width - pad - cornerL, height - pad);
    ctx.lineTo(width - pad, height - pad);
    ctx.lineTo(width - pad, height - pad - cornerL);
    ctx.stroke();

    // Telemetry text overlay in corners
    ctx.fillStyle = 'rgba(0, 255, 102, 0.85)';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText(`OPTICAL CV // v2.4`, pad + 8, pad + 16);
    ctx.fillText(`FPS: ${fps}`, width - pad - 60, pad + 16);
    ctx.fillText(`SUBJECTS: ${boundingBox.detected ? 1 : 0}`, pad + 8, height - pad - 8);
    ctx.fillText(`STATUS: ${isScanning ? 'SCANNING...' : 'STANDBY'}`, width - pad - 120, height - pad - 8);
  }
}

export const visionEngine = new VisionEngine();
