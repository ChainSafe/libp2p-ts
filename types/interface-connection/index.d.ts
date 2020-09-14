// Type definitions for interface-connection 0.3.2
// Project: https://github.com/libp2p/interface-connection
// Definitions by: Jaco Greeff <https://github.com/jacogr>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="multiaddr"/>

// model after abortable-iterator
type Source<T> = AsyncIterable<T> | Iterable<T>;
type Sink<TSource, TReturn = void> = (source: Source<TSource>) => TReturn;
declare interface Stream<TSource = unknown, TReturn = unknown> {
  source: Source<TSource>;
  sink: Sink<TSource, TReturn>;
  close: () => void;
  reset: () => void;
}

declare interface LibP2pConnection {
    localPeer: import("peer-id");
    remotePeer: import("peer-id");
    id: string;
    newStream(protocols: string[]): Promise<{stream: Stream; protocol: string}>;
    addStream( stream: Stream, meta: {protocol: string, metadata: Object}): void;
    removeStream(id: string): void;
    streams: Stream[];
    registry: Map<string, Stream>;
    localAddr: import("multiaddr");
    remoteAddr: import("multiaddr");
    stat: {status: 'open' | 'closing' | 'closed'; timeline: {open: Date; upgraded: Date; close: Date}; direction: 'inbound' | 'outbound'; multiplexer: string; encryption: string; tags: string[]}
    close(): Promise<void>;
}
