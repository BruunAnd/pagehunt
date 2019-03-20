export default class AudioManager {
    audioDirectory: string = "audio";
    audioFiles: Map<string, HTMLAudioElement>;

    constructor () {
        this.audioFiles = new Map<string, HTMLAudioElement>();

        this.registerAudio("rain", 0.5, true, true);
        this.registerAudio("footsteps", 1, true);
        this.registerAudio("victory");
        this.registerAudio("die");
        this.registerAudio("branch", 0.7);
    }

    private registerAudio(name: string, volume: number = 1, loop: boolean = false, autoplay: boolean = false, extension: string = "mp3") {
        const audio = new Audio(`${this.audioDirectory}/${name}.${extension}`);
        audio.volume = volume;
        audio.loop = loop;
        audio.autoplay = autoplay;
        this.audioFiles[name] = audio;

    }

    public playAudio(audio: string) {
        if (!this.isAudioPlaying(audio))
            this.audioFiles[audio].play();
    }

    public stopAudio(audio: string) {
        this.audioFiles[audio].pause();
        this.audioFiles[audio].currentTime = 0;
    }

    public isAudioPlaying(audio: string) {
        return !this.audioFiles[audio].paused;
    }
}