export enum AlertBtnText {
    OK = 'OK',
    UpdateEmail = 'Update Email',
    ResendEmail = 'Resend Email',
    Redirect = 'OK',
    Close = 'Close'
}

export enum ErrorCodes {
    usernameAlreadyInUse = 'auth/app-deleted',
    emailAlreadyInUse = 'auth/app-not-authorized',
    argumentError = 'auth/argument-error',
    invalidApiKey = 'auth/invalid-api-key',
    invalidUserToken = 'auth/invalid-user-token',
    networkRequestFailed = 'auth/network-request-failed',
    operationNotAllowed = 'auth/operation-not-allowed',
    requiresRecentLogin = 'auth/requires-recent-login',
    tooManyRequests = 'auth/too-many-requests',
    unauthorizedDomain = 'auth/unauthorized-domain',
    userDisabled = 'auth/user-disabled',
    userTokenExpired = 'auth/user-token-expired',
    webStorageUnsupported = 'auth/web-storage-unsupported',
    userMismatch = 'auth/user-mismatch',
    userNotFound = 'auth/user-not-found',
    invalidCredential = 'auth/invalid-credential',
    invalidVerificationCode = 'auth/invalid-verification-code',
    invalidVerificationId = 'auth/invalid-verification-id',
    wrongPassword = 'auth/wrong-password'
}
