import plano from '@plano-do-video';
export const FPS=plano.fps,WIDTH=1080,HEIGHT=1920,DURATION=plano.durationInFrames;
export const s=(seconds:number)=>Math.round(seconds*FPS);
