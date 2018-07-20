import { Injectable } from '@angular/core';

@Injectable()
export class UIService {

    constructor() {
    }

    private loadingState: boolean;
    private loadingMessage: string;

    public showLoading(loadingMessage?: string) {

        // Timeout used to avoid a change state error
        setTimeout(() => {
            this.loadingState = true;
            if (loadingMessage) {
                this.loadingMessage = loadingMessage;
            }
        }, 100);

    }

    public hideLoading() {
        this.loadingState = false;
        this.loadingMessage = null;
    }

    public getLoadingState(): boolean {
        return this.loadingState;
    }

    public getLoadingMessage(): string {
        return this.loadingMessage;
    }

}
