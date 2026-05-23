interface EventData {
    scrollDepth?: number;
    stayDuration?: number;
    elementId?: string;
    elementType?: string;
    elementText?: string;
    clickX?: number;
    clickY?: number;
    exposureDuration?: number;
    exposureRatio?: number;
    spmCode?: string;
    spmLevel?: number;
    [key: string]: unknown;
}
interface TrackerConfig {
    appId: string;
    endpoint: string;
    autoTrack?: AutoTrackConfig;
    batch?: BatchConfig;
    offline?: OfflineConfig;
}
interface AutoTrackConfig {
    pageView?: boolean | PageViewConfig;
    click?: boolean | ClickConfig;
    exposure?: boolean | ExposureConfig;
    scroll?: boolean | ScrollConfig;
    stay?: boolean | StayConfig;
}
interface PageViewConfig {
    SPA?: boolean;
    referrer?: boolean;
}
interface ClickConfig {
    enabled?: boolean;
    selector?: string[];
    excludeSelector?: string[];
    trackText?: boolean;
    trackPosition?: boolean;
}
interface ExposureConfig {
    enabled?: boolean;
    selector?: string[];
    threshold?: number;
    thresholdRatio?: number;
}
interface ScrollConfig {
    enabled?: boolean;
    thresholds?: number[];
    throttle?: number;
}
interface StayConfig {
    enabled?: boolean;
    threshold?: number;
}
interface BatchConfig {
    maxSize?: number;
    interval?: number;
}
interface OfflineConfig {
    enabled?: boolean;
    maxQueueSize?: number;
}
type EventType = 'page_view' | 'click' | 'exposure' | 'scroll' | 'stay' | 'custom' | 'session_start' | 'session_end' | 'session_heartbeat';

declare class Tracker {
    private config;
    private queue;
    private sender;
    private collectors;
    constructor(config: TrackerConfig);
    init(): void;
    track(eventType: EventType, data?: EventData): void;
    trackPageView(page: {
        url?: string;
        title?: string;
        referrer?: string;
    }): void;
    trackClick(element: Element, data?: EventData): void;
    trackExposure(element: Element, data?: EventData): void;
    flush(): Promise<void>;
    destroy(): void;
    private buildEvent;
    private generateEventId;
    private getUserId;
    private getAnonymousId;
    private parseUTM;
}

export { type AutoTrackConfig, Tracker, type TrackerConfig };
