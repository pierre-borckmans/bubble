var noble = require('noble-mac')

noble.on('stateChange', function(state) {
  console.log('stateChange')
  if (state === 'poweredOn') {
    console.log('poweredOn')
    noble.startScanning(['180d']);
  } else {
    noble.stopScanning();
  }
});

noble.on('scanStart', function(peripheral) {
    console.log('scan')
});

noble.on('warning', () => console.log('warn'));

noble.on('discover', function(peripheral) {
    console.log(peripheral.advertisement.localName);

    peripheral.connect(function(error){
      if (error) {
        console.log('error connecting')
      }
      console.log('connected')
      peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics){
        console.log('discovered all')
        characteristics[1].read((e,data) => console.log('pos:', JSON.stringify(data)))
        characteristics[2].read((e,data) => console.log('battery:', JSON.stringify(data)))
        characteristics[0].notify(true, (e) => {
          characteristics[0].on('data', (data) => {
            onData(toArrayBuffer(data))
          })
        });
      });
    });
});

function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
  }
  return ab;
}

function onData(buffer) {

  var dataView = new DataView(buffer);
  var flags = dataView.getUint8(0); // first byte is flags

  var hr;
  if (flags & 1) {
    hr = dataView.getUint16(1, true)
  } else {
    hr = dataView.getUint8(1, true)
  }
  console.log('HR:', hr)

  // if RR intervals are present (4th bit)
  if (flags & (1 << 4)) {
    var offset = calculateOffset(flags);
    var rrIntervalCount = (buffer.byteLength - offset) / 2;

    for (var i=0; i<rrIntervalCount; i++) {
        var unfilteredRRInterval = dataView.getUint16(offset, true); // true as little-endian
        var rrInterval = Math.floor(unfilteredRRInterval/1.024); // convert to milliseconds
        //console.log('rr interval:', rrInterval);
        processRR(rrInterval);
        offset += 2;
    }      
  } else {
    console.log('rr interval not available')
  }
}

function calculateOffset(flags) {
  var offset = 0; // the offset for RR intervals 
  offset += 1; // offset by 1 byte for flags byte
  // check format of BPM (1st bit)
  if (flags & 1) {
      offset += 2; // BPM is in UInt16 so offset by 2 bytes
  }
  else {
    offset += 1; // BPM is in UInt8 so offset by 1 byte
  }
  // check if energy expended is present (3rd bit)
  if (flags & (1 << 3)) { // 
      offset += 2; // EE available so offset by a further 2 bytes
  }
  return offset;
}


RRs = [];
function processRR(rr) {
  RRs.push(rr);
  N = Math.min(10, RRs.length);
  var mean = 0;
  for (var i=RRs.length-N; i<RRs.length; i++) {
    mean = mean + RRs[i];
  }
  mean = 60000/(mean/N);
  console.log('Instant HR', 60000/rr)
  console.log('Mean HR', mean)
  console.log('-')
}