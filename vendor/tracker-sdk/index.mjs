// src/collectors/PageCollector.ts
var PageCollector = class {
  constructor(config, callback) {
    this.lastUrl = "";
    this.handlePageLoad = () => {
      this.reportPageView();
    };
    this.handleRouteChange = () => {
      if (window.location.href !== this.lastUrl) {
        this.reportPageView();
        this.lastUrl = window.location.href;
      }
    };
    this.handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        this.reportPageView();
      }
    };
    this.handleUnload = () => {
      navigator.sendBeacon?.(this.buildBeaconUrl());
    };
    this.config = {
      SPA: config.SPA ?? false,
      referrer: config.referrer ?? true
    };
    this.callback = callback;
  }
  start() {
    window.addEventListener("load", this.handlePageLoad);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.addEventListener("beforeunload", this.handleUnload);
    if (this.config.SPA) {
      this.interceptHistory();
      window.addEventListener("popstate", this.handleRouteChange);
    }
    this.lastUrl = window.location.href;
  }
  stop() {
    window.removeEventListener("load", this.handlePageLoad);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("beforeunload", this.handleUnload);
    window.removeEventListener("popstate", this.handleRouteChange);
  }
  interceptHistory() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handleRouteChange();
    };
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handleRouteChange();
    };
  }
  reportPageView() {
    const spmData = this.extractBodySpmData();
    this.callback({
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      ...spmData
    });
  }
  extractBodySpmData() {
    const body = document.body;
    const spmAttr = body?.dataset?.trackSpm;
    if (spmAttr) {
      const parts = spmAttr.split("@");
      return {
        spmCode: parts[0] || void 0,
        spmLevel: parts[1] ? parseInt(parts[1]) : void 0
      };
    }
    return {};
  }
  buildBeaconUrl() {
    return "";
  }
};

// src/collectors/ClickCollector.ts
var ClickCollector = class {
  constructor(config, callback) {
    this.throttleTimer = null;
    this.lastClickTime = 0;
    // Throttle: 300ms
    this.THROTTLE_MS = 300;
    this.config = {
      enabled: config.enabled ?? true,
      selector: config.selector ?? ["[data-track]", "button", "a", 'input[type="submit"]'],
      excludeSelector: config.excludeSelector ?? [],
      trackText: config.trackText ?? true,
      trackPosition: config.trackPosition ?? true
    };
    this.callback = callback;
    this.boundHandler = this.handleClick.bind(this);
  }
  start() {
    if (!this.config.enabled) return;
    document.addEventListener("click", this.boundHandler, true);
  }
  stop() {
    document.removeEventListener("click", this.boundHandler, true);
  }
  handleClick(e) {
    const mouseEvent = e;
    const target = e.target;
    if (!target) return;
    if (!this.shouldTrack(target)) return;
    const now = Date.now();
    if (now - this.lastClickTime < this.THROTTLE_MS) return;
    this.lastClickTime = now;
    const spmData = this.extractSpmData(target);
    const rect = target.getBoundingClientRect();
    const data = {
      elementId: target.dataset.track || target.id,
      elementType: target.tagName.toLowerCase(),
      elementText: this.config.trackText ? target.textContent?.slice(0, 100) || "" : void 0,
      ...spmData
    };
    if (this.config.trackPosition) {
      data.clickX = Math.round(mouseEvent.clientX - rect.left);
      data.clickY = Math.round(mouseEvent.clientY - rect.top);
    }
    this.callback(data);
  }
  extractSpmData(element) {
    const spmAttr = element.dataset.trackSpm;
    if (spmAttr) {
      const parts = spmAttr.split("@");
      return {
        spmCode: parts[0] || void 0,
        spmLevel: parts[1] ? parseInt(parts[1]) : void 0
      };
    }
    return {};
  }
  shouldTrack(element) {
    for (const sel of this.config.selector) {
      if (element.matches(sel) || element.closest(sel)) {
        for (const excl of this.config.excludeSelector) {
          if (element.matches(excl) || element.closest(excl)) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }
};

// src/collectors/ExposureCollector.ts
var ExposureCollector = class {
  constructor(config, callback) {
    this.observer = null;
    this.exposedElements = /* @__PURE__ */ new Map();
    this.config = {
      enabled: config.enabled ?? true,
      selector: config.selector ?? ["[data-exposure]"],
      threshold: config.threshold ?? 500,
      thresholdRatio: config.thresholdRatio ?? 0.5
    };
    this.callback = callback;
  }
  start() {
    if (!this.config.enabled) return;
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: this.config.thresholdRatio,
        rootMargin: "0px"
      }
    );
    const elements = document.querySelectorAll(this.config.selector.join(","));
    console.log(`[Exposure] Observing ${elements.length} elements with selector: ${this.config.selector.join(", ")}`);
    elements.forEach((el) => this.observer?.observe(el));
  }
  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
  handleIntersection(entries) {
    entries.forEach((entry) => {
      const el = entry.target;
      const trackId = el.dataset.trackId;
      if (entry.isIntersecting && entry.intersectionRatio >= this.config.thresholdRatio) {
        if (!this.exposedElements.has(el)) {
          console.log(`[Exposure] Captured: ${trackId} (ratio: ${Math.round(entry.intersectionRatio * 100)}%)`);
          const spmData = this.extractSpmData(el);
          this.callback({
            elementId: trackId,
            elementType: el.tagName.toLowerCase(),
            elementText: el.textContent?.slice(0, 100) || "",
            exposureDuration: 0,
            exposureRatio: entry.intersectionRatio,
            ...spmData
          });
          this.exposedElements.set(el, Date.now());
        }
      }
    });
  }
  extractSpmData(element) {
    const spmAttr = element.dataset.trackSpm;
    if (spmAttr) {
      const parts = spmAttr.split("@");
      return {
        spmCode: parts[0] || void 0,
        spmLevel: parts[1] ? parseInt(parts[1]) : void 0
      };
    }
    return {};
  }
};

// src/collectors/ScrollCollector.ts
var ScrollCollector = class {
  constructor(config, callback) {
    this.maxScrollDepth = 0;
    this.lastScrollTime = 0;
    this.throttleTimer = null;
    // Throttle: 500ms
    this.THROTTLE_MS = 500;
    this.handleScroll = () => {
      if (this.throttleTimer !== null) return;
      this.throttleTimer = window.setTimeout(() => {
        this.throttleTimer = null;
        this.reportScrollDepth();
      }, this.config.throttle);
    };
    this.config = {
      enabled: config.enabled ?? true,
      thresholds: config.thresholds ?? [25, 50, 75, 100],
      throttle: config.throttle ?? 500
    };
    this.callback = callback;
  }
  start() {
    if (!this.config.enabled) return;
    window.addEventListener("scroll", this.handleScroll, { passive: true });
  }
  stop() {
    window.removeEventListener("scroll", this.handleScroll);
    if (this.throttleTimer !== null) {
      clearTimeout(this.throttleTimer);
    }
  }
  reportScrollDepth() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollPercent = Math.round(scrollTop / (docHeight - windowHeight) * 100);
    if (scrollPercent > this.maxScrollDepth) {
      for (const threshold of this.config.thresholds.sort((a, b) => a - b)) {
        if (this.maxScrollDepth < threshold && scrollPercent >= threshold) {
          this.callback({
            scrollDepth: threshold
          });
        }
      }
      this.maxScrollDepth = scrollPercent;
    }
  }
};

// src/collectors/SessionCollector.ts
var SessionCollector = class {
  constructor() {
    this.eventCount = 0;
    // Session timeout: 30 minutes
    this.TIMEOUT_MS = 30 * 60 * 1e3;
    this.handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        this.recordActivity();
      }
    };
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.lastActiveTime = this.startTime;
  }
  start() {
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    setInterval(() => {
      if (document.visibilityState === "visible") {
        this.recordActivity();
      }
    }, 3e4);
  }
  stop() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }
  getSessionInfo() {
    if (Date.now() - this.lastActiveTime > this.TIMEOUT_MS) {
      this.sessionId = this.generateSessionId();
      this.startTime = Date.now();
      this.lastActiveTime = this.startTime;
      this.eventCount = 0;
    }
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      lastActiveTime: this.lastActiveTime,
      eventCount: this.eventCount
    };
  }
  recordActivity() {
    this.lastActiveTime = Date.now();
    this.eventCount++;
  }
  generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
};

// src/queue/EventQueue.ts
var STORAGE_KEY = "gf_tracker_queue";
var EventQueue = class {
  constructor(config) {
    this.queue = [];
    this.maxRetries = 3;
    this.maxSize = config.maxQueueSize ?? 100;
    this.loadFromStorage();
  }
  enqueue(event) {
    const entry = { ...event, _retryCount: 0 };
    this.queue.push(entry);
    while (this.queue.length > this.maxSize) {
      this.queue.shift();
    }
    this.saveToStorage();
  }
  enqueueBatch(events) {
    for (const event of events) {
      const entry = { ...event, _retryCount: 0 };
      this.queue.push(entry);
    }
    while (this.queue.length > this.maxSize) {
      this.queue.shift();
    }
    this.saveToStorage();
  }
  drain() {
    const events = this.queue.map((e) => {
      const { _retryCount, ...event } = e;
      return event;
    });
    this.queue = [];
    this.saveToStorage();
    return events;
  }
  size() {
    return this.queue.length;
  }
  async flush(endpoint) {
    if (this.queue.length === 0) return true;
    const events = this.drain();
    console.log(`[Tracker] Flushing ${events.length} events to ${endpoint}`);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events })
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      console.log(`[Tracker] Successfully sent ${events.length} events`);
      return true;
    } catch (error) {
      console.error("[Tracker] Failed to flush events:", error);
      this.enqueueBatch(events);
      return false;
    }
  }
  /**
   * Immediately flush a single high-priority event (exposure/click) without waiting for batch threshold.
   * This ensures critical business metrics are reported in real-time.
   */
  async flushImmediate(event, endpoint) {
    console.log(`[Tracker] Immediately flushing ${event.eventType} event: ${event.eventId}`);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: [event] })
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      console.log(`[Tracker] Successfully sent immediate ${event.eventType} event`);
      return true;
    } catch (error) {
      console.error("[Tracker] Failed to flush immediate event:", error);
      return false;
    }
  }
  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.warn("[Tracker] Failed to save queue to localStorage");
    }
  }
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (e) {
      this.queue = [];
    }
  }
  clear() {
    this.queue = [];
    this.saveToStorage();
  }
};

// src/sender/Sender.ts
var Sender = class {
  constructor(endpoint, queue) {
    this.timer = null;
    this.endpoint = endpoint;
    this.queue = queue;
  }
  start(config) {
    this.config = {
      maxSize: config.maxSize ?? 50,
      interval: config.interval ?? 2e3
    };
    this.timer = window.setInterval(() => {
      this.flush();
    }, this.config.interval);
  }
  stop() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  async flush() {
    if (this.queue.size() >= this.config.maxSize) {
      await this.queue.flush(this.endpoint);
    }
  }
};

// src/tracker/Tracker.ts
var IMMEDIATE_EVENT_TYPES = ["exposure", "click"];
var Tracker = class {
  constructor(config) {
    this.collectors = /* @__PURE__ */ new Set();
    this.config = {
      endpoint: config.endpoint,
      appId: config.appId,
      autoTrack: config.autoTrack ?? {},
      batch: config.batch ?? { maxSize: 50, interval: 2e3 },
      offline: config.offline ?? { enabled: true, maxQueueSize: 100 }
    };
    this.queue = new EventQueue(this.config.offline);
    this.sender = new Sender(this.config.endpoint, this.queue);
    const sessionCollector = new SessionCollector();
    this.collectors.add(sessionCollector);
    if (this.config.autoTrack.pageView) {
      const pageConfig = typeof this.config.autoTrack.pageView === "object" ? this.config.autoTrack.pageView : {};
      const pageCollector = new PageCollector(pageConfig, (data) => this.track("page_view", data));
      this.collectors.add(pageCollector);
    }
    if (this.config.autoTrack.click) {
      const clickConfig = typeof this.config.autoTrack.click === "object" ? this.config.autoTrack.click : { enabled: true };
      const clickCollector = new ClickCollector(
        { enabled: true, ...clickConfig },
        (data) => this.track("click", data)
      );
      this.collectors.add(clickCollector);
    }
    if (this.config.autoTrack.exposure) {
      const exposureConfig = typeof this.config.autoTrack.exposure === "object" ? this.config.autoTrack.exposure : { enabled: true };
      const exposureCollector = new ExposureCollector(
        { enabled: true, threshold: 500, ...exposureConfig },
        (data) => this.track("exposure", data)
      );
      this.collectors.add(exposureCollector);
    }
    if (this.config.autoTrack.scroll) {
      const scrollConfig = typeof this.config.autoTrack.scroll === "object" ? this.config.autoTrack.scroll : { enabled: true };
      const scrollCollector = new ScrollCollector(
        { enabled: true, thresholds: [25, 50, 75, 100], ...scrollConfig },
        (data) => this.track("scroll", data)
      );
      this.collectors.add(scrollCollector);
    }
    this.sender.start(this.config.batch);
  }
  init() {
    console.log("[Tracker] Initializing with config:", {
      endpoint: this.config.endpoint,
      appId: this.config.appId,
      autoTrack: this.config.autoTrack,
      batch: this.config.batch,
      offline: this.config.offline
    });
    this.collectors.forEach((c) => {
      console.log("[Tracker] Starting collector:", c.constructor.name);
      c.start();
    });
    window.addEventListener("online", () => {
      console.log("[Tracker] Network online, flushing queue");
      this.queue.flush(this.config.endpoint);
    });
    console.log("[Tracker] Initialization complete");
  }
  track(eventType, data) {
    const event = this.buildEvent(eventType, data);
    console.log(`[Tracker] Event captured: ${eventType}`, event);
    this.queue.enqueue(event);
    if (IMMEDIATE_EVENT_TYPES.includes(eventType)) {
      this.queue.flushImmediate(event, this.config.endpoint);
    } else {
      this.queue.flush(this.config.endpoint);
    }
  }
  trackPageView(page) {
    this.track("page_view", {
      ...page
    });
  }
  trackClick(element, data) {
    const rect = element.getBoundingClientRect();
    const position = {
      clickX: Math.round(rect.x + rect.width / 2),
      clickY: Math.round(rect.y + rect.height / 2)
    };
    this.track("click", {
      elementId: element.dataset?.track || element.id,
      elementType: element.tagName.toLowerCase(),
      elementText: element.textContent?.slice(0, 100) || "",
      ...position,
      ...data
    });
  }
  trackExposure(element, data) {
    this.track("exposure", {
      elementId: element.dataset?.exposure || element.id,
      elementType: element.tagName.toLowerCase(),
      elementText: element.textContent?.slice(0, 100) || "",
      ...data
    });
  }
  async flush() {
    await this.queue.flush(this.config.endpoint);
  }
  destroy() {
    this.collectors.forEach((c) => c.stop());
    this.sender.stop();
  }
  buildEvent(eventType, data) {
    const sessionCollector = Array.from(this.collectors).find((c) => c instanceof SessionCollector);
    const sessionInfo = sessionCollector?.getSessionInfo();
    return {
      eventId: this.generateEventId(),
      eventType,
      userId: this.getUserId(),
      anonymousId: this.getAnonymousId(),
      timestamp: Date.now(),
      clientTime: Date.now(),
      platform: "web",
      appVersion: this.config.appId,
      sdkVersion: "1.0.0",
      page: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer
      },
      session: sessionInfo ? { sessionId: sessionInfo.sessionId, startTime: sessionInfo.startTime } : void 0,
      device: {
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: navigator.language
      },
      context: this.parseUTM(),
      data
    };
  }
  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
  getUserId() {
    return void 0;
  }
  getAnonymousId() {
    const key = "gf_anonymous_id";
    let anonymousId = localStorage.getItem(key);
    if (!anonymousId) {
      anonymousId = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem(key, anonymousId);
    }
    return anonymousId;
  }
  parseUTM() {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") || void 0,
      utmMedium: params.get("utm_medium") || void 0,
      utmCampaign: params.get("utm_campaign") || void 0,
      utmTerm: params.get("utm_term") || void 0,
      utmContent: params.get("utm_content") || void 0
    };
  }
};
export {
  Tracker
};
