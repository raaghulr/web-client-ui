/* eslint class-methods-use-this: "off" */
/* eslint no-unused-vars: "off" */

import type { dh as DhType } from '@deephaven/jsapi-types';
import { type Formatter } from '@deephaven/jsapi-utils';
import type { Layout, Data } from 'plotly.js';
import { type FilterColumnMap, type FilterMap } from './ChartUtils';

export type ChartEvent = DhType.Event<unknown>;

export interface FigureUpdateEventData {
  series: DhType.plot.Series[];
  getArray: (
    series: DhType.plot.Series,
    sourceType: number,
    mappingFunc: (value: unknown) => unknown
  ) => unknown[];
}

export type RenderOptions = {
  /** Allow WebGL as an option. Defaults to `true`, explicitly set to `false` to disable. */
  webgl?: boolean;
};

/**
 * Model for a Chart
 * All of these methods should return very quickly.
 * If data needs to be loaded asynchronously, return something immediately, then trigger an event for the chart to refresh.
 */
class ChartModel {
  static EVENT_UPDATED = 'ChartModel.EVENT_UPDATED';

  static EVENT_DISCONNECT = 'ChartModel.EVENT_DISCONNECT';

  static EVENT_RECONNECT = 'ChartModel.EVENT_RECONNECT';

  static EVENT_DOWNSAMPLESTARTED = 'ChartModel.EVENT_DOWNSAMPLESTARTED';

  static EVENT_DOWNSAMPLEFINISHED = 'ChartModel.EVENT_DOWNSAMPLEFINISHED';

  static EVENT_DOWNSAMPLEFAILED = 'ChartModel.EVENT_DOWNSAMPLEFAILED';

  static EVENT_DOWNSAMPLENEEDED = 'ChartModel.EVENT_DOWNSAMPLENEEDED';

  static EVENT_LOADFINISHED = 'ChartModel.EVENT_LOADFINISHED';

  static EVENT_ERROR = 'ChartModel.EVENT_ERROR';

  static EVENT_BLOCKER = 'ChartModel.EVENT_BLOCKER';

  static EVENT_BLOCKER_CLEAR = 'ChartModel.EVENT_BLOCKER_CLEAR';

  static EVENT_LAYOUT_UPDATED = 'ChartModel.EVENT_LAYOUT_UPDATED';

  constructor(dh: typeof DhType) {
    this.dh = dh;
    this.listeners = [];
    this.isDownsamplingDisabled = false;
  }

  dh: typeof DhType;

  listeners: ((event: ChartEvent) => void)[];

  /** Formatter settings for the chart, such as how to format dates and numbers */
  formatter?: Formatter;

  renderOptions?: RenderOptions;

  rect?: DOMRect;

  isDownsamplingDisabled: boolean;

  title?: string;

  getData(): Partial<Data>[] {
    return [];
  }

  getDefaultTitle(): string {
    return '';
  }

  getLayout(): Partial<Layout> {
    return {};
  }

  getFilterColumnMap(): FilterColumnMap {
    return new Map();
  }

  isFilterRequired(): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFilter(filter: FilterMap): void {}

  /**
   * Close this model, clean up any underlying subscriptions
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close(): void {}

  /**
   * Set the formatter to use when charting the data.
   * @param formatter The formatter to use to format the charting data
   */
  setFormatter(formatter: Formatter): void {
    this.formatter = formatter;
  }

  /**
   * Set additional options for rendering the chart
   * @param renderOptions Options for rendering the chart
   */
  setRenderOptions(renderOptions: RenderOptions): void {
    this.renderOptions = renderOptions;
  }

  /**
   * Disable downsampling
   * @param isDownsamplingDisabled True if downsampling should be disabled
   */
  setDownsamplingDisabled(isDownsamplingDisabled: boolean): void {
    this.isDownsamplingDisabled = isDownsamplingDisabled;
  }

  /**
   * Set the dimensions of the plot. May be needed to evaluate some of the percents
   * @param rect The bounding rectangle of the plot
   */
  setDimensions(rect: DOMRect): void {
    this.rect = rect;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  /**
   * Subscribe to this ChartModel and start listening for all events.
   * @param callback Callback when an event occurs
   */
  subscribe(callback: (event: ChartEvent) => void): void {
    this.listeners.push(callback);
  }

  unsubscribe(callback: (event: ChartEvent) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  fireEvent(event: ChartEvent): void {
    for (let i = 0; i < this.listeners.length; i += 1) {
      this.listeners[i](event);
    }
  }

  fireUpdate(data: unknown): void {
    this.fireEvent(new CustomEvent(ChartModel.EVENT_UPDATED, { detail: data }));
  }

  fireDisconnect(): void {
    this.fireEvent(new CustomEvent(ChartModel.EVENT_DISCONNECT));
  }

  fireReconnect(): void {
    this.fireEvent(new CustomEvent(ChartModel.EVENT_RECONNECT));
  }

  fireDownsampleStart(detail: unknown): void {
    this.fireEvent(
      new CustomEvent(ChartModel.EVENT_DOWNSAMPLESTARTED, { detail })
    );
  }

  fireDownsampleFinish(detail: unknown): void {
    this.fireEvent(
      new CustomEvent(ChartModel.EVENT_DOWNSAMPLEFINISHED, { detail })
    );
  }

  fireDownsampleFail(detail: unknown): void {
    this.fireEvent(
      new CustomEvent(ChartModel.EVENT_DOWNSAMPLEFAILED, { detail })
    );
  }

  fireDownsampleNeeded(detail: unknown): void {
    this.fireEvent(
      new CustomEvent(ChartModel.EVENT_DOWNSAMPLENEEDED, { detail })
    );
  }

  fireLoadFinished(): void {
    this.fireEvent(new CustomEvent(ChartModel.EVENT_LOADFINISHED));
  }

  fireError(detail: string[]): void {
    this.fireEvent(new CustomEvent(ChartModel.EVENT_ERROR, { detail }));
  }

  fireBlocker(detail: string[]): void {
    this.fireEvent(new CustomEvent(ChartModel.EVENT_BLOCKER, { detail }));
  }

  fireBlockerClear(): void {
    this.fireEvent(new CustomEvent(ChartModel.EVENT_BLOCKER_CLEAR));
  }

  fireLayoutUpdated(detail: Partial<Layout>): void {
    this.fireEvent(
      new CustomEvent(ChartModel.EVENT_LAYOUT_UPDATED, { detail })
    );
  }
}

export default ChartModel;
