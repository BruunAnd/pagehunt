export enum AudioFile {
    Rain = "rain",
    Footsteps = "footsteps",
    Victory = "victory",
    Die = "die"
}

export default class AudioManager {
    audioDirectory: string = "audio";
    audioFiles: Map<AudioFile, HTMLAudioElement>;

    constructor () {
        this.audioFiles = new Map<AudioFile, HTMLAudioElement>();

        this.audioFiles[AudioFile.Rain] = new Audio(`${this.audioDirectory}/rain.mp3`);
        this.audioFiles[AudioFile.Footsteps] = new Audio(`${this.audioDirectory}/footsteps.mp3`);
        this.audioFiles[AudioFile.Victory] = new Audio(`${this.audioDirectory}/victory.mp3`);
        this.audioFiles[AudioFile.Die] = new Audio(`${this.audioDirectory}/die`);

        this.audioFiles[AudioFile.Rain].loop = true;
        this.audioFiles[AudioFile.Footsteps].loop = true;

        this.audioFiles[AudioFile.Rain].play();
    }

    public playAudio(audio: AudioFile) {
        if (!this.isAudioPlaying(audio))
            this.audioFiles[audio].play();
    }

    public stopAudio(audio: AudioFile) {
        this.audioFiles[audio].pause();
        this.audioFiles[audio].currentTime = 0;
    }

    public isAudioPlaying(audio: AudioFile) {
        return !this.audioFiles[audio].paused;
    }
}