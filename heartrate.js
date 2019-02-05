var noble = require('noble-mac');

let label = document.querySelector('.hr');





noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning(['180d']);
  } else {
    noble.stopScanning();
  }
});

noble.on('scanStart', function(peripheral) {
});


function dispatchHeartRate(value) {
    label.textContent = ""+value;
}

noble.on('discover', function(peripheral) {
  // Once peripheral is discovered, stop scanning
  noble.stopScanning();

  // connect to the heart rate sensor
  peripheral.connect(function(error){
    var serviceUUID = ["180d"];
    var characteristicUUID = ["2a37"];

    peripheral.discoverSomeServicesAndCharacteristics(serviceUUID, characteristicUUID, function(error, services, characteristics){
      characteristics[0].notify(true, function(error){
        characteristics[0].on('data', function(data, isNotification){
          console.log('data is: ' + data[1]);
          dispatchHeartRate(data[1]);
        });
      });
    });
  });
});
