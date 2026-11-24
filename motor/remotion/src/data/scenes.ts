import plano from '@plano-do-video';
import {evaluateTrack} from '../utils/animation';
export type BadgeVariant='positive'|'negative'|'info'|'warning';
export type SceneBadge={text:string;variant:BadgeVariant;appearAt:number;disappearAt?:number;subtitle?:string;slot?:'center'|'left'|'right';icon?:'?';size?:'normal'|'large'};
export const scenes=plano.scenes;
export const track=(target:string,frame:number,fallback=0)=>evaluateTrack(scenes,target,frame,plano.fps,fallback);
export const sceneAt=(frame:number)=>[...scenes].reverse().find(sc=>frame>=sc.startFrame)??scenes[0];
