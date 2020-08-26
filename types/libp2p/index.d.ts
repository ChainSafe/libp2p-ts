// Type definitions for libp2p 0.28.3
// Project: https://github.com/libp2p/js-libp2p
// Definitions by: Jaco Greeff <https://github.com/jacogr>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="libp2p-bootstrap"/>
/// <reference types="interface-connection"/>
/// <reference types="interface-transport"/>
/// <reference types="libp2p-kad-dht"/>
/// <reference types="libp2p-mdns"/>
/// <reference types="libp2p-mplex"/>
/// <reference types="libp2p-spdy"/>

declare namespace LibP2p {

    export type OptionsConfig = {
        contentRouting?: {},
        dht?: {
            kBucketSize?: number
        },
        peerDiscovery?: {
            autoDial?: boolean,
            enabled?: boolean,
            bootstrap?: {
                enabled?: boolean,
                list: Array<string | import("multiaddr")>,
                interval?: number,
            },
            mdns?: {
                enabled?: boolean,
                broadcast?: boolean,
                interval?: number,
                peerId: import("peer-id"),
                port?: number,
                serviceTag?: string
            },
            webRTCStar?: {
                interval?: number
                enabled?: boolean
            },
            websocketStar?: {
                enabled?: boolean
            }
        },
        peerRouting?: {},
        pubsub?: {
            enabled?: boolean,
            emitSelf?: boolean,
            signMessages?: boolean,
            strictSigning?: boolean
        },
        relay?: {
            enabled?: boolean,
            hop?: {
                enabled?: boolean,
                active?: boolean
            }
        }
    };

    export type OptionsModules = {
        connEncryption?: Array<ConnectionEncryption>,
        streamMuxer: Array<LibP2pMplex | LibP2pSpdy>,
        dht?: typeof LibP2pKadDht,
        peerDiscovery: Array<typeof LibP2pBootstrap | typeof LibP2pMdns | typeof import("@chainsafe/discv5").Discv5Discovery>,
        transport: LibP2pTransport[]
    };

    export type Options = {
        config: OptionsConfig,
        modules: OptionsModules,
        peerId?: import("peer-id"),
        addresses?: {listen?: string[], announce?: string[], noAnnounce?: string[]},
    };

    export interface ConnectionEncryption {
        protocol: string,
        secureInbound(localPeer: import("peer-id"), connection: LibP2pConnection, remotePeer: import("peer-id")): Promise<SecureConnection>;
        secureOutbound(localPeer: import("peer-id"), connection: LibP2pConnection, remotePeer?: import("peer-id")): Promise<SecureConnection>;
    }

    export interface SecureConnection {
        conn: LibP2pConnection,
        remotePeer: import("peer-id")
    }

    export type Peer = {
      id: import("peer-id");
      addresses: {multiaddr: import("multiaddr")}[];
      protocols: string[];
      metadata: Map<string, Buffer>;
    }

    export type Events =  'peer:discovery' | 'start' | 'stop';
    export type ConnectionEvents = 'peer:connect' | 'peer:disconnect';
}

declare class AddressBook {
    add(peerId: import("peer-id"), multiaddrs: import("multiaddr")[]): void;
    getMultiaddrsForPeer(peerId: import("peer-id")): import("multiaddr")[];
}

declare class ProtoBook {
    //peerId => protocols
    readonly data: Map<string, string[]>;
    set(peerId: import("peer-id"), protocols: string[]): ProtoBook;
    add(peerId: import("peer-id"), protocols: string[]): ProtoBook;
}

declare class MetadataBook {
    //peerId => protocols
    readonly data: Map<string, Map<string, Buffer>>;
    set(peerId: import("peer-id"), key: string, value: Buffer): ProtoBook;
    get(peerId: import("peer-id")): Map<string, Buffer>;
    getValue(peerId: import("peer-id"), key: string): Buffer;
    delete(peerId: import("peer-id")): boolean;
    deleteValue(peerId: import("peer-id"), key: string): boolean;
}

declare class PeerStore {
    readonly peers: Map<string, LibP2p.Peer>;
    readonly addressBook: AddressBook;
    readonly protoBook: ProtoBook;
    readonly metadataBook: MetadataBook;
    delete(peerId: import("peer-id")): boolean;
    get(peerId: import("peer-id")): LibP2p.Peer|undefined;
}

declare class Registrar {
    connections: Map<string, LibP2pConnection[]>;
    getConnection(peerId: import("peer-id")): LibP2pConnection;
    handle (): void
    register (): void
    unregister (): void
}

declare class ConnectionManager {
    on(event: LibP2p.ConnectionEvents, cb: (event: LibP2pConnection) => any): this;
    once(event: LibP2p.ConnectionEvents, cb: (event: LibP2pConnection) => any): this;
    removeListener(event: LibP2p.ConnectionEvents, cb: (event: LibP2pConnection) => any): this;
    get(peerId: import("peer-id")): LibP2pConnection | null;
}

declare class LibP2p {
    readonly _dht: LibP2pKadDht;

    constructor(options: LibP2p.Options);

    static create(options: LibP2p.Options): Promise<LibP2p>;

    readonly peerId: import("peer-id");
    readonly peerStore: PeerStore;
    readonly registrar: Registrar;
    readonly connectionManager: ConnectionManager;
    readonly _discovery: Map<"bootstrap" | "mdns" | "discv5", LibP2pBootstrap | LibP2pMdns | import("@chainsafe/discv5").Discv5Discovery>;
    readonly multiaddrs: import("multiaddr")[];

    dial(peerInfo: import("peer-id") | import("multiaddr") | string, options?: Object): Promise<LibP2pConnection | {stream: Stream; protocol: string}>;
    dialProtocol(peerInfo: import("peer-id") | import("multiaddr") | string, protocols: string[] | string, options?: Object): Promise<LibP2pConnection | {stream: Stream; protocol: string}>;
    hangUp(peerInfo: import("peer-id") | import("multiaddr") | string): Promise<void>;
    handle(protocols: string[] | string, handler: (param: {connection: LibP2pConnection; stream: Stream; protocol: string}) => void): void;
    unhandle(protocols: string[] | string): void;
    isStarted(): boolean;
    on(event: LibP2p.Events, cb: (event: any) => any): this;
    once(event: LibP2p.Events, cb: (event: any) => any): this;
    removeListener(event: LibP2p.Events, cb: (event: any) => any): this;
    ping(peerInfo: import("peer-id") | import("multiaddr") | string): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
}

declare module 'libp2p' {
    export default LibP2p;
}
