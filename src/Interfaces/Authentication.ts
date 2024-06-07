/**
 * Authentication response.
 */
export interface Authentication {
    /**
     * Request results
     */
    SigningResult: {
        /**
         * Root certificate
         */
        RootCertificate: string;

        /**
         * Auth Certificate
         */
        Certificate: string;
    };
}
