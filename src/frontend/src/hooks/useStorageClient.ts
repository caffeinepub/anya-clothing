import { HttpAgent } from "@icp-sdk/core/agent";
import { useEffect, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useActor } from "./useActor";

export function useStorageClient() {
  const { actor } = useActor();
  const [storageClient, setStorageClient] = useState<StorageClient | null>(
    null,
  );

  useEffect(() => {
    if (!actor) return;
    loadConfig().then((config) => {
      const agent = new HttpAgent({ host: config.backend_host });
      const client = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      setStorageClient(client);
    });
  }, [actor]);

  return storageClient;
}
