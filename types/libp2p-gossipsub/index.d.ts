// Type definitions for libp2p-gossipsub v0.2.3
// Project https://github.com/ChainSafe/gossipsub-js

/// <reference types="node"/>
/// <reference types="peer-info"/>

declare module 'libp2p-gossipsub' {
    export interface Registrar {
        handle: Function;
        register(topology: Object): string;
        unregister(id: string): boolean;
    }

    export interface IGossipMessage {
        ["message-id"]?: string;
        from: Buffer | string;
        data: Buffer;
        seqno: Buffer;
        topicIDs: string[];
    }

    export interface Options {
        emitSelf?: boolean,
        gossipIncoming?: boolean,
        fallbackToFloodsub?: boolean,
    }

    import * as Events from "events";

    interface GossipSub extends Events.EventEmitter {}

    class GossipSub  {
        constructor(peerInfo: PeerInfo, registrar: Registrar, options: Options);
        publish(topic: string, data: Buffer): Promise<void>;
        start(): Promise<void>;
        stop(): Promise<void>;
        subscribe(topic: string): void;
        unsubscribe(topic: string): void;
        validate(message: IGossipMessage): Promise<boolean>;
        _emitMessage(topics: string[], message: IGossipMessage): void;
        getTopics(): string[];
        _publish(messages: IGossipMessage[]): void;
    }

    export default GossipSub;
}
