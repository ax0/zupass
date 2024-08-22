import type { GPCPCDArgs } from "@pcd/gpc-pcd";
import type { CredentialRequest } from "@pcd/passport-interface";
import type { SerializedPCD } from "@pcd/pcd-types";

export type ZupassFolderContent =
  | {
      type: "folder";
      name: string;
    }
  | {
      type: "pcd";
      id: string;
      pcdType: SerializedPCD["type"];
    };

export interface ZupassFileSystem {
  list: (path: string) => Promise<ZupassFolderContent[]>;
  get: (path: string) => Promise<SerializedPCD>;
  put: (path: string, content: SerializedPCD) => Promise<void>;
  // Not yet implemented:
  delete: (path: string) => Promise<void>;
}

export interface ZupassGPC {
  prove: (args: GPCPCDArgs) => Promise<SerializedPCD>;
}

export interface ZupassFeeds {
  requestAddSubscription: (feedUrl: string, feedId: string) => Promise<void>;
}

export interface ZupassIdentity {
  getCredential: (req: CredentialRequest) => Promise<SerializedPCD>;
  getIdentityCommitment: () => Promise<bigint>;
  getAttestedEmails: () => Promise<SerializedPCD[]>;
}

export interface ZupassAPI {
  _version: "1";
  fs: ZupassFileSystem;
  gpc: ZupassGPC;
  feeds: ZupassFeeds;
  identity: ZupassIdentity;
}
