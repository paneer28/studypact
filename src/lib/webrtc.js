import Peer from 'simple-peer'

// Create an outbound (initiator) or inbound peer.
// onSignal is called with any signaling payload that needs to be delivered to
// the remote peer. onStream fires when a remote stream arrives.
export function createPeer({ initiator, stream, onSignal, onStream, onClose, onError }) {
  const peer = new Peer({
    initiator,
    trickle: true,
    stream,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' },
      ],
    },
  })
  peer.on('signal', onSignal)
  peer.on('stream', onStream)
  peer.on('close', () => onClose?.())
  peer.on('error', (err) => onError?.(err))
  return peer
}

export function isScreenShareSupported() {
  return typeof navigator !== 'undefined'
    && navigator.mediaDevices
    && typeof navigator.mediaDevices.getDisplayMedia === 'function'
}

export async function getDisplayStream() {
  return navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: 10 },
    audio: false,
  })
}
