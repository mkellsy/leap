import { pki } from "node-forge";

export interface CertificateRequest {
    key: pki.rsa.PrivateKey;
    cert: string;
}
