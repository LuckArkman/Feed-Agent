"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaConnectionState = void 0;
/**
 * WhatsApp connection state enum.
 * Mirrors the possible values of Baileys' `ConnectionState.connection` field.
 */
var WaConnectionState;
(function (WaConnectionState) {
    /** Socket created, handshake in progress. */
    WaConnectionState["CONNECTING"] = "connecting";
    /** Fully authenticated and ready to send/receive messages. */
    WaConnectionState["OPEN"] = "open";
    /** Disconnected — may reconnect depending on the reason. */
    WaConnectionState["CLOSE"] = "close";
})(WaConnectionState || (exports.WaConnectionState = WaConnectionState = {}));
